from flask import Flask, jsonify, request
from flask_cors import CORS
import os, json, datetime
from data_loader import load_trains, load_maintenance_logs, load_daily_requirements, load_full_train_data
from optimizer import optimize

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
AUDIT_FILE = os.path.join(BASE_DIR, "backend_audit.json")

app = Flask(__name__)
CORS(app)

@app.route("/api/trains", methods=["GET"])
def api_trains():
    return jsonify(load_trains())

@app.route("/api/full_trains", methods=["GET"])
def api_full_trains():
    # optional date parameter ?date=YYYY-MM-DD
    date = request.args.get("date")
    data = load_full_train_data(date)
    return jsonify(data)

@app.route("/api/maintenance", methods=["GET"])
def api_maintenance():
    return jsonify(load_maintenance_logs())

@app.route("/api/daily_requirements", methods=["GET"])
def api_daily_requirements():
    return jsonify(load_daily_requirements())

@app.route("/api/optimize", methods=["POST"])
def api_optimize():
    """Current date optimization endpoint"""
    payload = request.get_json() or {}
    weights = payload.get("weights", {
        "punctuality": 80, "maintenance": 60, "cleaning": 50, "branding": 80, "mileage": 50
    })
    
    result = optimize(weights)
    
    # Enhanced audit logging
    audit = {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "optimization_type": "current_date",
        "weights": weights,
        "result_summary": {
            "service_needed": result.get("service_needed", 0),
            "standby_needed": result.get("standby_needed", 0),
            "total_trains": result.get("summary", {}).get("total_trains", 0),
            "conflicts_found": result.get("summary", {}).get("conflicts_found", 0)
        },
        "plan": result.get("plan", []),
        "conflicts": result.get("conflicts", [])
    }
    
    _save_audit(audit)
    return jsonify(result)

@app.route("/api/optimize_date", methods=["POST"])
def api_optimize_date():
    """Date-specific optimization endpoint"""
    payload = request.get_json() or {}
    
    date_str = payload.get("date")
    if not date_str:
        return jsonify({"error": "Date parameter is required"}), 400
    
    weights = payload.get("weights", {
        "punctuality": 80, "maintenance": 60, "cleaning": 50, "branding": 80, "mileage": 50
    })
    
    requirements = payload.get("requirements", {"service": 15, "standby": 5})
    
    result = optimize(weights, date_str=date_str, requirements=requirements)
    
    # Enhanced audit logging for date-specific optimization
    audit = {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "optimization_type": "date_specific",
        "date": date_str,
        "weights": weights,
        "requirements": requirements,
        "result_summary": {
            "service_needed": result.get("service_needed", 0),
            "standby_needed": result.get("standby_needed", 0),
            "total_trains": result.get("summary", {}).get("total_trains", 0),
            "conflicts_found": result.get("summary", {}).get("conflicts_found", 0)
        },
        "plan": result.get("plan", []),
        "conflicts": result.get("conflicts", [])
    }
    
    _save_audit(audit)
    return jsonify(result)

@app.route("/api/optimize_batch", methods=["POST"])
def api_optimize_batch():
    """Batch optimization for multiple dates"""
    payload = request.get_json() or {}
    
    dates = payload.get("dates", [])
    if not dates:
        return jsonify({"error": "Dates array is required"}), 400
    
    weights = payload.get("weights", {
        "punctuality": 80, "maintenance": 60, "cleaning": 50, "branding": 80, "mileage": 50
    })
    
    requirements = payload.get("requirements", {"service": 15, "standby": 5})
    
    results = {}
    for date_str in dates:
        try:
            result = optimize(weights, date_str=date_str, requirements=requirements)
            results[date_str] = result
        except Exception as e:
            results[date_str] = {"error": str(e)}
    
    # Audit batch optimization
    audit = {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "optimization_type": "batch",
        "dates": dates,
        "weights": weights,
        "requirements": requirements,
        "results_summary": {
            "total_dates": len(dates),
            "successful": len([r for r in results.values() if "error" not in r]),
            "failed": len([r for r in results.values() if "error" in r])
        }
    }
    
    _save_audit(audit)
    return jsonify(results)

@app.route("/api/conflicts", methods=["GET"])
def api_conflicts():
    """Get recent conflicts from audit log"""
    try:
        if os.path.exists(AUDIT_FILE):
            with open(AUDIT_FILE, "r", encoding="utf-8") as f:
                audits = json.load(f)
            
            # Extract conflicts from recent optimizations
            recent_conflicts = []
            for audit in audits[:10]:  # Last 10 optimizations
                if audit.get("conflicts"):
                    recent_conflicts.append({
                        "timestamp": audit.get("timestamp"),
                        "date": audit.get("date"),
                        "conflicts": audit.get("conflicts")
                    })
            
            return jsonify(recent_conflicts)
        return jsonify([])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/audit", methods=["GET"])
def api_audit():
    """Get audit log with optional filtering"""
    try:
        if os.path.exists(AUDIT_FILE):
            with open(AUDIT_FILE, "r", encoding="utf-8") as f:
                audits = json.load(f)
            
            # Optional filtering
            limit = request.args.get("limit", type=int)
            optimization_type = request.args.get("type")
            
            if optimization_type:
                audits = [a for a in audits if a.get("optimization_type") == optimization_type]
            
            if limit:
                audits = audits[:limit]
            
            return jsonify(audits)
        return jsonify([])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/stats", methods=["GET"])
def api_stats():
    """Get optimization statistics"""
    try:
        if os.path.exists(AUDIT_FILE):
            with open(AUDIT_FILE, "r", encoding="utf-8") as f:
                audits = json.load(f)
            
            total_optimizations = len(audits)
            current_date_opts = len([a for a in audits if a.get("optimization_type") == "current_date"])
            date_specific_opts = len([a for a in audits if a.get("optimization_type") == "date_specific"])
            batch_opts = len([a for a in audits if a.get("optimization_type") == "batch"])
            
            total_conflicts = sum(len(a.get("conflicts", [])) for a in audits)
            avg_conflicts = total_conflicts / max(1, total_optimizations)
            
            return jsonify({
                "total_optimizations": total_optimizations,
                "optimization_types": {
                    "current_date": current_date_opts,
                    "date_specific": date_specific_opts,
                    "batch": batch_opts
                },
                "total_conflicts": total_conflicts,
                "avg_conflicts_per_optimization": round(avg_conflicts, 2),
                "last_optimization": audits[0].get("timestamp") if audits else None
            })
        return jsonify({
            "total_optimizations": 0,
            "optimization_types": {"current_date": 0, "date_specific": 0, "batch": 0},
            "total_conflicts": 0,
            "avg_conflicts_per_optimization": 0,
            "last_optimization": None
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def _save_audit(audit):
    """Helper function to save audit entries"""
    try:
        if os.path.exists(AUDIT_FILE):
            with open(AUDIT_FILE, "r", encoding="utf-8") as f:
                arr = json.load(f)
        else:
            arr = []
        
        arr.insert(0, audit)
        
        # Keep only last 1000 entries to prevent file from growing too large
        if len(arr) > 1000:
            arr = arr[:1000]
        
        with open(AUDIT_FILE, "w", encoding="utf-8") as f:
            json.dump(arr, f, indent=2)
    except Exception as e:
        print("Audit write error:", e)

@app.route("/")
def root():
    return jsonify({"status": "ok", "message": "MetroPal backend running", "version": "2.0"})

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)