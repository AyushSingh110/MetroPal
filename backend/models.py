from sqlalchemy import Column, Integer, String, Float, Boolean, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class TrainInventory(Base):
    __tablename__ = "train_inventory"

    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, nullable=False)
    train_id = Column(String, nullable=False)
    fitness_score = Column(Float, nullable=True)
    last_maintenance_date = Column(Date, nullable=True)
    maintenance_due = Column(Boolean, nullable=True)
    job_card_status = Column(String, nullable=True)
    maintenance_type = Column(String, nullable=True)
    mileage_since_maintenance = Column(Integer, nullable=True)
    total_mileage = Column(Integer, nullable=True)
    last_cleaning_date = Column(Date, nullable=True)
    needs_cleaning = Column(Boolean, nullable=True)
    rs_cert_expiry = Column(Date, nullable=True)
    sig_cert_expiry = Column(Date, nullable=True)
    telecom_cert_expiry = Column(Date, nullable=True)
    branding_active = Column(Boolean, nullable=True)  
    branding_start_date = Column(Date, nullable=True)
    branding_priority = Column(Float, nullable=True)
    branding_company = Column(String, nullable=True)
    recommended_action = Column(String, nullable=True)
    stabling_bay_id = Column(String, nullable=True)

   