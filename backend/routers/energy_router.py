from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(tags=["Energy Dashboard"])


@router.get("/energy", response_model=schemas.EnergyStatsResponse)
def get_energy_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get energy stats for dashboard (total, consumed, capacity, surplus)."""
    energy = (
        db.query(models.EnergyData)
        .filter(models.EnergyData.user_id == current_user.id)
        .order_by(models.EnergyData.timestamp.desc())
        .first()
    )

    if not energy:
        return {
            "total_kwh": 0.0,
            "consumed_kwh": 0.0,
            "capacity_kwh": 0.0,
            "surplus_kwh": 0.0,
            "usage_percent": 0.0,
        }

    usage_pct = (energy.consumed_kwh / energy.capacity_kwh * 100) if energy.capacity_kwh > 0 else 0
    return {
        "total_kwh": energy.total_kwh,
        "consumed_kwh": energy.consumed_kwh,
        "capacity_kwh": energy.capacity_kwh,
        "surplus_kwh": energy.surplus_kwh,
        "usage_percent": round(usage_pct, 1),
    }


@router.get("/energy-history", response_model=schemas.EnergyHistoryResponse)
def get_energy_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get time-series energy data for the dashboard chart."""
    records = (
        db.query(models.EnergyData)
        .filter(models.EnergyData.user_id == current_user.id)
        .order_by(models.EnergyData.timestamp.asc())
        .all()
    )

    data_points = []
    total_generated = 0.0
    for rec in records:
        data_points.append({
            "time": rec.timestamp.strftime("%I%p"),
            "kwh": rec.total_kwh,
        })
        total_generated += rec.total_kwh

    return {
        "total_generated": round(total_generated, 2),
        "data": data_points,
    }
