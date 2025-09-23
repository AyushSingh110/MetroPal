import json, os, datetime
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

def load_trains():
    p = os.path.join(DATA_DIR, "train_fleet.json")
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)

def load_maintenance_logs():
    p = os.path.join(DATA_DIR, "maintenance_log.json")
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)

def load_daily_requirements():
    p = os.path.join(DATA_DIR, "daily_requirements.json")
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)

def load_full_train_data(date=None):
    """Loads full_train_data.json and returns a flat list for the requested date.
       If date is None, uses today's date in YYYY-MM-DD or falls back to the latest date available."""
    p = os.path.join(DATA_DIR, "full_train_data.json")
    with open(p, "r", encoding="utf-8") as f:
        raw = json.load(f)
    if date is None:
        today = datetime.date.today().isoformat()
    else:
        today = date
    if today in raw:
        return raw[today]
    keys = sorted(raw.keys())
    if keys:
        return raw[keys[-1]]
    return []

def today_requirement(today=None):
    dr = load_daily_requirements()
    if today is None:
        today = datetime.date.today().isoformat()
    for d in dr:
        if d.get("date")==today:
            return d
    return dr[-1]
