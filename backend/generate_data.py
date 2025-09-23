import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import json

CONFIG = {
    "num_trains": 25,
    "start_date": datetime(2025, 9, 18),
    "simulation_days": 7,
    "contract_duration_days": 90,
    "maintenance_interval_mileage": 20000,
    "daily_mileage_range": (300, 550),
    "seed": 42,
    "branding_companies": ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"],
    "stabling_bays": {
        "IBL": [f"IBL-{i}" for i in range(1, 11)],
        "SBL": [f"SBL-{i}" for i in range(1, 31)],
        "CBL": [f"CBL-{i}" for i in range(1, 5)]
    }
}

random.seed(CONFIG["seed"])
np.random.seed(CONFIG["seed"])

def get_health_and_certs(mileage_since_maint, maint_interval, current_date):
    degradation_factor = min(1.0, mileage_since_maint / (maint_interval * 1.5))
    vibration_level = max(0.1, 1.0 - degradation_factor - random.uniform(0, 0.2))
    brake_pad_health = max(0.1, 1.0 - degradation_factor - random.uniform(0, 0.15))
    hvac_health = max(0.1, 1.0 - degradation_factor - random.uniform(0, 0.1))
    fitness_score = min(vibration_level, brake_pad_health, hvac_health)
    rs_expiry_days = max(1, np.random.randint(1, 90) - int(degradation_factor * 30))
    rs_cert_expiry = current_date + timedelta(days=rs_expiry_days)
    sig_cert_expiry = current_date + timedelta(days=np.random.randint(5, 120))
    telecom_cert_expiry = current_date + timedelta(days=np.random.randint(5, 180))
    return fitness_score, rs_cert_expiry, sig_cert_expiry, telecom_cert_expiry

def get_job_card(mileage_since_maint, maint_interval):
    if mileage_since_maint > maint_interval:
        return "Open", random.choice(["Major Repair", "Critical Failure"])
    if random.random() < 0.15:
        return "Open", "Minor Defect"
    return "Closed", "Routine"

def update_branding_status(current_date, branding_start, branding_end, contract_length):
    if current_date > branding_end:
        branding_start = current_date
        branding_end = branding_start + timedelta(days=contract_length)
        branding_active = 1
        branding_company = random.choice(CONFIG["branding_companies"])
    else:
        branding_active = 1 if branding_start <= current_date <= branding_end else 0
        branding_company = None if not branding_active else random.choice(CONFIG["branding_companies"])
    days_remaining = max(0, (branding_end - current_date).days)
    branding_priority = 1 / (1 + days_remaining)
    return branding_active, branding_start, branding_end, branding_priority, branding_company

# --- Main Data Generation ---
all_data_by_date = {}
train_states = []
for i in range(CONFIG["num_trains"]):
    mileage_since_maintenance = np.random.randint(1000, CONFIG["maintenance_interval_mileage"] + 5000)
    avg_daily_mileage = sum(CONFIG["daily_mileage_range"]) / 2
    days_since_maintenance = int(mileage_since_maintenance / avg_daily_mileage)
    train_states.append({
        "train_id": f"KMRL-T{str(i+1).zfill(2)}",
        "total_mileage": 100000 + (i * 2000) + np.random.randint(0, 30000),
        "mileage_since_maintenance": mileage_since_maintenance,
        "last_cleaning_date": CONFIG["start_date"] - timedelta(days=np.random.randint(0, 10)),
        "last_maintenance_date": CONFIG["start_date"] - timedelta(days=days_since_maintenance),
        "branding_start_date": CONFIG["start_date"] - timedelta(days=np.random.randint(1, 120)),
    })

for day in range(CONFIG["simulation_days"]):
    current_date = CONFIG["start_date"] + timedelta(days=day)
    date_key = current_date.strftime('%Y-%m-%d')
    daily_records = []
    
    for train in train_states:
        fitness_score, rs_cert, sig_cert, telecom_cert = get_health_and_certs(
            train["mileage_since_maintenance"], CONFIG["maintenance_interval_mileage"], current_date
        )
        job_card_status, maint_type = get_job_card(
            train["mileage_since_maintenance"], CONFIG["maintenance_interval_mileage"]
        )
        maint_due = train["mileage_since_maintenance"] > CONFIG["maintenance_interval_mileage"]
        needs_cleaning = (current_date - train["last_cleaning_date"]).days > 7
        
        branding_end = train["branding_start_date"] + timedelta(days=CONFIG["contract_duration_days"])
        brand_active, new_brand_start, _, brand_priority, brand_company = update_branding_status(
            current_date, train["branding_start_date"], branding_end, CONFIG["contract_duration_days"]
        )

        rec_action = "Maintenance (IBL)" if job_card_status == "Open" or maint_due else \
                     "Standby (Cleaning)" if needs_cleaning else "Revenue Service"

        bay_id = random.choice(CONFIG["stabling_bays"]["IBL"]) if rec_action == "Maintenance (IBL)" else \
                 random.choice(CONFIG["stabling_bays"]["CBL"]) if rec_action == "Standby (Cleaning)" else \
                 random.choice(CONFIG["stabling_bays"]["SBL"])

        record = {
            "train_id": train["train_id"], "fitness_score": round(fitness_score, 3),
            "last_maintenance_date": train["last_maintenance_date"].strftime('%Y-%m-%d'),
            "maintenance_due": maint_due, "job_card_status": job_card_status, "maintenance_type": maint_type,
            "mileage_since_maintenance": train["mileage_since_maintenance"], "total_mileage": train["total_mileage"],
            "last_cleaning_date": train["last_cleaning_date"].strftime('%Y-%m-%d'), "needs_cleaning": needs_cleaning,
            "rs_cert_expiry": rs_cert.strftime('%Y-%m-%d'), "sig_cert_expiry": sig_cert.strftime('%Y-%m-%d'),
            "telecom_cert_expiry": telecom_cert.strftime('%Y-%m-%d'), "branding_active": brand_active,
            "branding_start_date": new_brand_start.strftime('%Y-%m-%d'), "branding_priority": round(brand_priority, 3),
            "branding_company": brand_company, "recommended_action": rec_action, "stabling_bay_id": bay_id
        }
        daily_records.append(record)
        
        if rec_action == "Revenue Service":
            train["total_mileage"] += np.random.randint(*CONFIG["daily_mileage_range"])
            train["mileage_since_maintenance"] += np.random.randint(*CONFIG["daily_mileage_range"])
        elif rec_action == "Maintenance (IBL)":
            train["mileage_since_maintenance"] = 0
            train["last_maintenance_date"] = current_date
        elif rec_action == "Standby (Cleaning)":
            train["last_cleaning_date"] = current_date
        train["branding_start_date"] = new_brand_start
        
    all_data_by_date[date_key] = daily_records

output_filename = "full_train_data.json"
output_path = f"../data/{output_filename}" 
with open(output_path, 'w') as f:
    json.dump(all_data_by_date, f, indent=2)

print(f"\n✅ Successfully generated and saved data to '{output_path}'")