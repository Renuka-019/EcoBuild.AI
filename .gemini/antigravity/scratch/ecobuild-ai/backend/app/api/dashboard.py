from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all_models import Building, AnalysisResult, ActivityLog, Recommendation, User
from app.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    buildings = db.query(Building).filter(Building.user_id == current_user.id).all()
    total_buildings = len(buildings)

    if total_buildings == 0:
        return {
            "total_buildings": 0,
            "total_analyzed": 0,
            "average_score": 0.0,
            "total_energy_kwh": 0.0,
            "total_water_litres": 0.0,
            "total_carbon_tons": 0.0,
            "potential_energy_savings_kwh": 0.0,
            "potential_water_savings_litres": 0.0,
            "recent_buildings": [],
            "activity_timeline": [],
            "score_distribution": {"Platinum": 0, "Gold": 0, "Silver": 0, "Certified": 0, "Needs Improvement": 0},
            "top_recommendations": []
        }

    total_score = 0.0
    analyzed_count = 0
    total_energy = 0.0
    total_water = 0.0
    total_carbon = 0.0
    potential_energy_savings = 0.0
    potential_water_savings = 0.0

    score_distribution = {
        "Platinum": 0,
        "Gold": 0,
        "Silver": 0,
        "Certified": 0,
        "Needs Improvement": 0
    }

    recent_buildings = []
    top_recommendations = []

    for b in sorted(buildings, key=lambda x: x.created_at, reverse=True):
        latest_a = b.analyses[-1] if b.analyses else None
        if latest_a:
            analyzed_count += 1
            total_score += latest_a.overall_sustainability_score
            total_energy += latest_a.annual_energy_kwh
            total_water += latest_a.annual_water_litres
            total_carbon += latest_a.total_carbon_tons
            potential_energy_savings += latest_a.potential_energy_savings_kwh
            potential_water_savings += latest_a.potential_water_savings_litres
            
            cls = latest_a.classification
            if cls in score_distribution:
                score_distribution[cls] += 1
            else:
                score_distribution["Needs Improvement"] += 1

            for r in latest_a.recommendations:
                if not r.applied and len(top_recommendations) < 4:
                    top_recommendations.append({
                        "id": r.id,
                        "title": r.title,
                        "category": r.category,
                        "priority": r.priority,
                        "benefit": r.environmental_benefit,
                        "savings_kwh": r.expected_savings_kwh,
                        "building_name": b.project_name
                    })

        recent_buildings.append({
            "id": b.id,
            "project_name": b.project_name,
            "building_type": b.building_type,
            "location": b.location,
            "area_m2": b.built_up_area_m2,
            "latest_score": latest_a.overall_sustainability_score if latest_a else None,
            "latest_classification": latest_a.classification if latest_a else None,
            "latest_analysis_id": latest_a.id if latest_a else None,
            "created_at": b.created_at
        })

    avg_score = round(total_score / max(analyzed_count, 1), 1) if analyzed_count > 0 else 0.0

    # Activity timeline
    logs = db.query(ActivityLog).filter(ActivityLog.user_id == current_user.id).order_by(ActivityLog.created_at.desc()).limit(8).all()
    activity_timeline = [
        {
            "id": l.id,
            "action": l.action,
            "details": l.details,
            "created_at": l.created_at
        }
        for l in logs
    ]

    return {
        "total_buildings": total_buildings,
        "total_analyzed": analyzed_count,
        "average_score": avg_score,
        "total_energy_kwh": round(total_energy, 2),
        "total_water_litres": round(total_water, 2),
        "total_carbon_tons": round(total_carbon, 2),
        "potential_energy_savings_kwh": round(potential_energy_savings, 2),
        "potential_water_savings_litres": round(potential_water_savings, 2),
        "recent_buildings": recent_buildings[:5],
        "activity_timeline": activity_timeline,
        "score_distribution": score_distribution,
        "top_recommendations": top_recommendations
    }
