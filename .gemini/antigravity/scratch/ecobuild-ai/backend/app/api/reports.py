import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.all_models import Report, Building, AnalysisResult, ActivityLog, User
from app.auth import get_current_user
from app.services.pdf_report_generator import generate_pdf_report

router = APIRouter(prefix="/reports", tags=["Reports"])

class ReportGenerateRequest(BaseModel):
    building_id: int
    report_title: str = "Sustainability Performance Audit"

@router.post("/generate")
def create_report(
    req: ReportGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    b = db.query(Building).filter(Building.id == req.building_id).first()
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
    if b.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    latest_a = b.analyses[-1] if b.analyses else None
    if not latest_a:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Building must be analyzed before generating a report"
        )

    # Format data for generator
    b_data = {
        "project_name": b.project_name,
        "building_type": b.building_type,
        "location": b.location,
        "built_up_area_m2": b.built_up_area_m2,
        "floors": b.floors,
        "occupants": b.occupants,
        "construction_year": b.construction_year
    }

    a_data = {
        "overall_sustainability_score": latest_a.overall_sustainability_score,
        "classification": latest_a.classification,
        "energy_score": latest_a.energy_score,
        "water_score": latest_a.water_score,
        "carbon_score": latest_a.carbon_score,
        "materials_score": latest_a.materials_score,
        "energy": {
            "energy_intensity_kwh_m2": latest_a.energy_intensity_kwh_m2,
            "benchmark_eui": latest_a.calculation_metadata.get("benchmarks", {}).get("eui", 120) if latest_a.calculation_metadata else 120,
            "energy_efficiency_class": latest_a.energy_efficiency_class,
            "actual_solar_kwh": (b.energy_detail.solar_capacity_kw * 1450 * 0.78) if b.energy_detail else 0,
            "potential_solar_generation_kwh": latest_a.potential_solar_generation_kwh,
        },
        "water": {
            "water_per_occupant_lpcd": latest_a.water_per_occupant_lpcd,
            "benchmark_lpcd": latest_a.calculation_metadata.get("benchmarks", {}).get("water_lpcd", 100) if latest_a.calculation_metadata else 100,
            "rainwater_harvest_potential_litres": latest_a.rainwater_harvest_potential_litres,
        },
        "carbon": {
            "operational_carbon_tons": latest_a.operational_carbon_tons,
            "embodied_carbon_tons": latest_a.embodied_carbon_tons,
            "carbon_intensity_kg_m2": latest_a.carbon_intensity_kg_m2,
            "concrete_carbon_tons": latest_a.concrete_carbon_tons,
            "steel_carbon_tons": latest_a.steel_carbon_tons,
        },
        "recommendations": [
            {
                "title": r.title,
                "category": r.category,
                "priority": r.priority,
                "suggested_improvement": r.suggested_improvement,
                "environmental_benefit": r.environmental_benefit,
                "implementation_difficulty": r.implementation_difficulty,
                "estimated_cost_category": r.estimated_cost_category,
                "expected_savings_kwh": r.expected_savings_kwh,
                "expected_savings_water_l": r.expected_savings_water_l,
                "expected_savings_carbon_tons": r.expected_savings_carbon_tons,
            }
            for r in latest_a.recommendations
        ]
    }

    filename = f"ecobuild_audit_b{b.id}_{latest_a.id}.pdf"
    filepath = os.path.join(settings.REPORT_DIR, filename)

    generate_pdf_report(b_data, a_data, filepath)

    report_rec = Report(
        building_id=b.id,
        user_id=current_user.id,
        report_title=req.report_title,
        report_type="Full Environmental Audit",
        file_path=filepath,
        score=latest_a.overall_sustainability_score,
        summary=f"Audit rating {latest_a.overall_sustainability_score}/100 ({latest_a.classification}) for {b.project_name}"
    )
    db.add(report_rec)
    db.add(ActivityLog(
        user_id=current_user.id,
        action="GENERATE_REPORT",
        target_type="Report",
        details=f"Generated PDF report for {b.project_name}"
    ))
    db.commit()
    db.refresh(report_rec)

    return {
        "id": report_rec.id,
        "building_id": b.id,
        "report_title": report_rec.report_title,
        "score": report_rec.score,
        "download_url": f"{settings.API_V1_STR}/reports/{report_rec.id}/download",
        "created_at": report_rec.created_at
    }

@router.get("")
def list_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reps = db.query(Report).filter(Report.user_id == current_user.id).order_by(Report.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "building_id": r.building_id,
            "building_name": r.building.project_name if r.building else "N/A",
            "report_title": r.report_title,
            "report_type": r.report_type,
            "score": r.score,
            "created_at": r.created_at,
            "download_url": f"{settings.API_V1_STR}/reports/{r.id}/download"
        }
        for r in reps
    ]

@router.get("/{report_id}/download")
def download_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    r = db.query(Report).filter(Report.id == report_id).first()
    if not r:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    if r.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    if not os.path.exists(r.file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report file not found on disk")

    return FileResponse(
        r.file_path,
        media_type="application/pdf",
        filename=os.path.basename(r.file_path)
    )
