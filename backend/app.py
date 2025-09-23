from flask import Flask, jsonify, request
from flask_cors import CORS
import os, json, datetime
from data_loader import load_trains, load_maintenance_logs, load_daily_requirements, load_full_train_data
from optimizer import optimize
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import TrainInventory

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
AUDIT_FILE = os.path.join(BASE_DIR, "backend_audit.json")

app = Flask(__name__)
CORS(app)

engine = create_engine("sqlite:///metro.db")
Session = sessionmaker(bind=engine)

@app.route("/api/traininventory", methods=["GET"])
def get_train_inventory():
    session = Session()
    date_filter = request.args.get("date")

    query = session.query(TrainInventory)
    if date_filter:
        try:
            parsed_date = datetime.datetime.strptime(date_filter, "%Y-%m-%d").date()
            query = query.filter(TrainInventory.date == parsed_date)
        except ValueError:
            pass

    trains = query.all()
    session.close()

    result = [
        {
            "train_id": t.train_id,
            "recommended_action": t.recommended_action,
            "fitness_score": t.fitness_score,
            "last_maintenance_date": str(t.last_maintenance_date) if t.last_maintenance_date else None,
            "total_mileage": t.total_mileage,
            "branding_active": bool(t.branding_active),
        }
        for t in trains
    ]

    return jsonify(result)


@app.route("/api/trains", methods=["GET"])
def api_trains():
    return jsonify(load_trains())

@app.route("/api/maintenance", methods=["GET"])
def api_maintenance():
    return jsonify(load_maintenance_logs())

@app.route("/api/daily_requirements", methods=["GET"])
def api_daily_requirements():
    return jsonify(load_daily_requirements())

@app.route("/api/optimize", methods=["POST"])
def api_optimize():
    payload = request.get_json() or {}
    weights = payload.get("weights", {
        "punctuality": 80, "maintenance":60, "cleaning":50, "branding":80, "mileage":50
    })
    result = optimize(weights)
    # save audit
    audit = {"timestamp": datetime.datetime.utcnow().isoformat()+"Z", "weights":weights, "result_summary": {"service_needed": result.get("service_needed",0), "standby_needed": result.get("standby_needed",0)}, "plan": result.get("plan",[])}
    try:
        if os.path.exists(AUDIT_FILE):
            with open(AUDIT_FILE,"r",encoding="utf-8") as f:
                arr = json.load(f)
        else:
            arr = []
        arr.insert(0,audit)
        with open(AUDIT_FILE,"w",encoding="utf-8") as f:
            json.dump(arr, f, indent=2)
    except Exception as e:
        print("Audit write error:", e)
    return jsonify(result)

@app.route("/api/audit", methods=["GET"])
def api_audit():
    if os.path.exists(AUDIT_FILE):
        with open(AUDIT_FILE,"r",encoding="utf-8") as f:
            return jsonify(json.load(f))
    return jsonify([])

@app.route("/")
def root():
    return jsonify({"status":"ok", "message":"MetroPal backend running"})

if __name__=="__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
