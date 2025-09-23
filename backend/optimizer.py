import math, datetime, json, os
from data_loader import load_trains, today_requirement, load_maintenance_logs

def _days_since(datestr, ref=None):
    if not datestr:
        return 9999
    refd = datetime.date.today() if ref is None else ref
    try:
        dt = datetime.datetime.strptime(datestr, "%Y-%m-%d").date()
        return (refd - dt).days
    except Exception:
        return 9999

def optimize(weights):
    trains = load_trains()
    today_req = today_requirement()
    service_needed = today_req.get("service_trains_required", 0)
    standby_needed = today_req.get("standby_trains_required", 0)

    max_km = max((t.get("km_since_last_maintenance") or 0) for t in trains) or 1
    max_days = max((_days_since(t.get("last_maintenance_date")) for t in trains)) or 1

    scored = []
    for t in trains:
        health = (t.get("health_score") or 0) / 100.0
        is_branded = 1.0 if t.get("is_branded") else 0.0
        km = (t.get("km_since_last_maintenance") or 0)
        mileage_metric = 1.0 - (km / max_km)  
        days = _days_since(t.get("last_maintenance_date") or "")
        maintenance_metric = 1.0 - (days / max_days) if max_days>0 else 0.0
        cleaning_metric = 0.5

        wsum = sum(weights.get(k,0) for k in weights) or 1
        score = 0.0
        score += (weights.get("punctuality",0)/wsum) * health
        score += (weights.get("maintenance",0)/wsum) * maintenance_metric
        score += (weights.get("cleaning",0)/wsum) * cleaning_metric
        score += (weights.get("branding",0)/wsum) * is_branded
        score += (weights.get("mileage",0)/wsum) * mileage_metric

        reasons = []
        reasons.append({"metric":"health","value":round(health,2)})
        reasons.append({"metric":"maintenance_age_days","value":int(days)})
        reasons.append({"metric":"mileage_rank","value":round(mileage_metric,2)})
        reasons.append({"metric":"is_branded","value":bool(t.get("is_branded"))})

        scored.append({"train":t,"score":score,"reasons":reasons})

    maintenance_trains = [s for s in scored if s["train"].get("current_status")=="Maintenance"]
    eligible = [s for s in scored if s["train"].get("current_status")!="Maintenance"]

    eligible_sorted = sorted(eligible, key=lambda x: x["score"], reverse=True)
    plan = []
    for s in eligible_sorted[:service_needed]:
        plan.append({"train_id": s["train"]["train_id"], "assignment":"Service", "score": round(s["score"],3), "reasons": s["reasons"]})
    for s in eligible_sorted[service_needed:service_needed+standby_needed]:
        plan.append({"train_id": s["train"]["train_id"], "assignment":"Standby", "score": round(s["score"],3), "reasons": s["reasons"]})
    for s in eligible_sorted[service_needed+standby_needed:]:
        plan.append({"train_id": s["train"]["train_id"], "assignment":"IBL", "score": round(s["score"],3), "reasons": s["reasons"]})
    for s in maintenance_trains:
        plan.append({"train_id": s["train"]["train_id"], "assignment":"IBL", "score": round(s["score"],3), "reasons": s["reasons"] + [{"note":"Forced IBL due to maintenance status"}]})

    conflict_alerts = []
    branding_weight = weights.get("branding",0)
    if branding_weight > 60:
        for p in plan:
            if p["assignment"]=="IBL":
                tr = next((t for t in trains if t["train_id"]==p["train_id"]), None)
                if tr and tr.get("is_branded"):
                    conflict_alerts.append({"train_id":p["train_id"], "issue":"Branded train assigned to IBL while branding priority high"})

    return {"date": today_req.get("date"), "service_needed":service_needed, "standby_needed":standby_needed, "plan": plan, "conflicts": conflict_alerts}