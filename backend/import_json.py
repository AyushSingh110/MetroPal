import json
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, TrainInventory

engine = create_engine('sqlite:///metro.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

def parse_date(d):
    return datetime.strptime(d, "%Y-%m-%d").date() if d else None

with open('C:/Users/Anagha/Documents/GitHub/MetroPal/data/full_train_data.json', 'r') as f:
    data = json.load(f)

for date_str, trains in data.items():
    for train in trains:
        obj = TrainInventory(
            date=parse_date(date_str),
            train_id=train.get("train_id"),
            fitness_score=train.get("fitness_score"),
            last_maintenance_date=parse_date(train.get("last_maintenance_date")),
            maintenance_due=train.get("maintenance_due"),
            job_card_status=train.get("job_card_status"),
            maintenance_type=train.get("maintenance_type"),
            mileage_since_maintenance=train.get("mileage_since_maintenance"),
            total_mileage=train.get("total_mileage"),
            last_cleaning_date=parse_date(train.get("last_cleaning_date")),
            needs_cleaning=train.get("needs_cleaning"),
            rs_cert_expiry=parse_date(train.get("rs_cert_expiry")),
            sig_cert_expiry=parse_date(train.get("sig_cert_expiry")),
            telecom_cert_expiry=parse_date(train.get("telecom_cert_expiry")),
            branding_active=train.get("branding_active"),
            branding_start_date=parse_date(train.get("branding_start_date")),
            branding_priority=train.get("branding_priority"),
            branding_company=train.get("branding_company"),
            recommended_action=train.get("recommended_action"),
            stabling_bay_id=train.get("stabling_bay_id"),
        )
        session.add(obj)

session.commit()
