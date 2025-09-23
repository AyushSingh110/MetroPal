import math, datetime, json, os
from data_loader import load_trains, today_requirement, load_maintenance_logs, load_full_train_data

def _days_since(datestr, ref=None):
    """Calculate days since a given date string"""
    if not datestr:
        return 9999
    refd = datetime.date.today() if ref is None else ref
    try:
        dt = datetime.datetime.strptime(datestr, "%Y-%m-%d").date()
        return (refd - dt).days
    except Exception:
        return 9999

def optimize(weights, date_str=None, requirements=None):
    """
    Enhanced optimize function that uses your existing data_loader:
    - Uses load_full_train_data() from your data_loader.py
    - Supports both current date and specific date optimization
    - Improved scoring and conflict detection
    """
    
    # Load data using your existing data loader
    if date_str:
        trains = load_full_train_data(date=date_str)
        current_date = date_str
    else:
        trains = load_full_train_data()  # Uses today's date by default
        current_date = datetime.date.today().strftime("%Y-%m-%d")
    
    if not trains:
        return {"error": f"No data available for date {current_date}"}
    
    # Determine requirements
    if date_str:
        # Use provided requirements or defaults for specific date
        if requirements:
            service_needed = requirements.get("service", 15)
            standby_needed = requirements.get("standby", 5)
        else:
            service_needed = 15  # Default values
            standby_needed = 5
    else:
        # Use today's requirements from daily_requirements.json
        try:
            today_req = today_requirement()
            service_needed = today_req.get("service_trains_required", 15)
            standby_needed = today_req.get("standby_trains_required", 5)
        except:
            # Fallback to defaults if today_requirement() fails
            service_needed = 15
            standby_needed = 5
    
    # Calculate normalization factors for better scoring
    max_km = max((t.get("km_since_last_maintenance", 0) or t.get("mileage_since_maintenance", 0) for t in trains)) or 1
    max_days = max((_days_since(t.get("last_maintenance_date")) for t in trains)) or 1
    
    # --- Enhanced Scoring Logic ---
    scored = []
    for t in trains:
        # Use your actual data structure from generate.py
        health = t.get("fitness_score", 0)  # Already a value between 0-1
        is_branded = 1.0 if t.get("branding_active", 0) == 1 else 0.0
        branding_priority = t.get("branding_priority", 0)
        
        # Use your actual mileage field name
        km = t.get("mileage_since_maintenance", 0)
        mileage_metric = 1.0 - (km / max_km) if max_km > 0 else 0.0
        
        # Maintenance age scoring using your field
        days = _days_since(t.get("last_maintenance_date", ""))
        maintenance_metric = 1.0 - (days / max_days) if max_days > 0 else 0.0
        
        # Cleaning metric based on your needs_cleaning field
        cleaning_metric = 0.8 if not t.get("needs_cleaning", False) else 0.2
        
        # Normalize weights
        weight_sum = sum(weights.get(k, 0) for k in weights) or 1
        
        # Calculate weighted score using your data structure
        score = 0.0
        score += (weights.get("punctuality", 0) / weight_sum) * health
        score += (weights.get("readiness", 0) / weight_sum) * health  # Alternative name for health
        score += (weights.get("maintenance", 0) / weight_sum) * maintenance_metric  
        score += (weights.get("cleaning", 0) / weight_sum) * cleaning_metric
        score += (weights.get("branding", 0) / weight_sum) * (is_branded + branding_priority) / 2
        score += (weights.get("mileage", 0) / weight_sum) * mileage_metric
        
        # Detailed reasons for transparency using your actual data
        reasons = [
            {"metric": "fitness_score", "value": round(health, 3)},
            {"metric": "maintenance_age_days", "value": int(days)},
            {"metric": "mileage_since_maintenance", "value": int(km)},
            {"metric": "mileage_rank", "value": round(mileage_metric, 3)},
            {"metric": "branding_active", "value": bool(t.get("branding_active", 0))},
            {"metric": "branding_priority", "value": round(branding_priority, 3)},
            {"metric": "needs_cleaning", "value": bool(t.get("needs_cleaning", False))},
            {"metric": "cleaning_score", "value": round(cleaning_metric, 2)}
        ]
        
        scored.append({"train": t, "score": score, "reasons": reasons})
    
    # --- Enhanced Assignment Logic ---
    # Handle your actual data structure for maintenance detection
    maintenance_trains = []
    eligible = []
    
    for s in scored:
        train = s["train"]
        # Check maintenance indicators from your data structure
        is_maintenance = (
            train.get("recommended_action") == "Maintenance (IBL)" or
            train.get("job_card_status") == "Open" or
            train.get("maintenance_due", False)
        )
        
        if is_maintenance:
            maintenance_trains.append(s)
        else:
            eligible.append(s)
    
    # Sort eligible trains by score
    eligible_sorted = sorted(eligible, key=lambda x: x["score"], reverse=True)
    
    # Create optimized plan
    plan = []
    
    # Assign Service trains (highest scores)
    for s in eligible_sorted[:service_needed]:
        plan.append({
            "train_id": s["train"]["train_id"],
            "assignment": "Service",
            "score": round(s["score"], 3),
            "reasons": s["reasons"]
        })
    
    # Assign Standby trains (next highest scores)
    for s in eligible_sorted[service_needed:service_needed + standby_needed]:
        plan.append({
            "train_id": s["train"]["train_id"],
            "assignment": "Standby", 
            "score": round(s["score"], 3),
            "reasons": s["reasons"]
        })
    
    # Assign remaining eligible trains to IBL
    for s in eligible_sorted[service_needed + standby_needed:]:
        plan.append({
            "train_id": s["train"]["train_id"],
            "assignment": "IBL",
            "score": round(s["score"], 3),
            "reasons": s["reasons"]
        })
    
    # Add maintenance trains
    for s in maintenance_trains:
        plan.append({
            "train_id": s["train"]["train_id"],
            "assignment": "IBL",
            "score": round(s["score"], 3),
            "reasons": s["reasons"] + [{"note": "Forced IBL due to maintenance status"}]
        })
    
    # --- Enhanced Conflict Detection ---
    conflict_alerts = []
    
    # Check for branded trains in IBL when branding priority is high
    branding_weight = weights.get("branding", 0)
    if branding_weight > 60:
        for p in plan:
            if p["assignment"] == "IBL":
                tr = next((s["train"] for s in scored if s["train"]["train_id"] == p["train_id"]), None)
                if tr and tr.get("branding_active", 0) == 1:
                    conflict_alerts.append({
                        "train_id": p["train_id"],
                        "issue": f"Branded train ({tr.get('branding_company', 'Unknown')}) assigned to IBL while branding priority is high",
                        "severity": "medium",
                        "branding_priority": tr.get("branding_priority", 0)
                    })
    
    # Check for high-fitness trains in IBL (potential resource waste)
    for p in plan:
        if p["assignment"] == "IBL":
            tr = next((s["train"] for s in scored if s["train"]["train_id"] == p["train_id"]), None)
            if tr:
                fitness_score = tr.get("fitness_score", 0)
                if fitness_score > 0.8:  # High fitness threshold (0-1 scale)
                    conflict_alerts.append({
                        "train_id": p["train_id"],
                        "issue": f"High-fitness train ({fitness_score:.1%}) assigned to IBL",
                        "severity": "low"
                    })
    
    # Check for maintenance overdue trains in active service
    for p in plan:
        if p["assignment"] in ["Service", "Standby"]:
            tr = next((s["train"] for s in scored if s["train"]["train_id"] == p["train_id"]), None)
            if tr and tr.get("maintenance_due", False):
                conflict_alerts.append({
                    "train_id": p["train_id"],
                    "issue": f"Maintenance overdue train assigned to {p['assignment']}",
                    "severity": "high",
                    "mileage_since_maintenance": tr.get("mileage_since_maintenance", 0)
                })
    
    # Check for high mileage trains in service - FIXED: removed CONFIG reference
    high_mileage_threshold = 18000  # 90% of 20,000 km maintenance interval
    for p in plan:
        if p["assignment"] in ["Service", "Standby"]:
            tr = next((s["train"] for s in scored if s["train"]["train_id"] == p["train_id"]), None)
            if tr:
                mileage = tr.get("mileage_since_maintenance", 0)
                if mileage > high_mileage_threshold:
                    conflict_alerts.append({
                        "train_id": p["train_id"],
                        "issue": f"High-mileage train ({mileage:,} km) assigned to {p['assignment']} - nearing maintenance interval",
                        "severity": "medium",
                        "mileage_since_maintenance": mileage
                    })
    
    # Check for trains with open job cards in service
    for p in plan:
        if p["assignment"] in ["Service", "Standby"]:
            tr = next((s["train"] for s in scored if s["train"]["train_id"] == p["train_id"]), None)
            if tr and tr.get("job_card_status") == "Open":
                conflict_alerts.append({
                    "train_id": p["train_id"],
                    "issue": f"Train with open job card ({tr.get('maintenance_type', 'Unknown')}) assigned to {p['assignment']}",
                    "severity": "high" if tr.get("maintenance_type") in ["Major Repair", "Critical Failure"] else "medium"
                })
    
    # Check for trains needing cleaning in service when cleaning priority is high
    cleaning_weight = weights.get("cleaning", 0)
    if cleaning_weight > 50:
        for p in plan:
            if p["assignment"] == "Service":
                tr = next((s["train"] for s in scored if s["train"]["train_id"] == p["train_id"]), None)
                if tr and tr.get("needs_cleaning", False):
                    conflict_alerts.append({
                        "train_id": p["train_id"],
                        "issue": "Train needing cleaning assigned to Service while cleaning priority is high",
                        "severity": "low",
                        "last_cleaning_date": tr.get("last_cleaning_date")
                    })
    
    return {
        "date": current_date,
        "service_needed": service_needed,
        "standby_needed": standby_needed,
        "plan": plan,
        "conflicts": conflict_alerts,
        "summary": {
            "total_trains": len(plan),
            "service_assigned": len([p for p in plan if p["assignment"] == "Service"]),
            "standby_assigned": len([p for p in plan if p["assignment"] == "Standby"]),
            "ibl_assigned": len([p for p in plan if p["assignment"] == "IBL"]),
            "conflicts_found": len(conflict_alerts),
            "avg_service_score": round(
                sum(p["score"] for p in plan if p["assignment"] == "Service") / 
                max(1, len([p for p in plan if p["assignment"] == "Service"])), 3
            )
        }
    }

# Backward compatibility function
def optimize_plan(date_str, weights, requirements):
    """
    Wrapper function for backward compatibility
    """
    return optimize(weights, date_str=date_str, requirements=requirements)