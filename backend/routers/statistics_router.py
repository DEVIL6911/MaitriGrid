from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(tags=["Statistics"])


@router.get("/statistics", response_model=schemas.StatisticsResponse)
def get_statistics(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get statistics: electricity saved %, solar power stats."""
    # Get latest energy data
    energy = (
        db.query(models.EnergyData)
        .filter(models.EnergyData.user_id == current_user.id)
        .order_by(models.EnergyData.timestamp.desc())
        .first()
    )

    if not energy:
        return {
            "electricity_saved_percent": 0.0,
            "total_generated_kwh": 0.0,
            "total_consumed_kwh": 0.0,
            "solar_value_kwh": 0.0,
            "solar_produced_kwh": 0.0,
            "solar_consumed_kwh": 0.0,
        }

    # Calculate electricity saved as percentage of surplus vs capacity
    saved_pct = (energy.surplus_kwh / energy.capacity_kwh * 100) if energy.capacity_kwh > 0 else 0

    return {
        "electricity_saved_percent": round(saved_pct, 1),
        "total_generated_kwh": energy.total_kwh,
        "total_consumed_kwh": energy.consumed_kwh,
        "solar_value_kwh": energy.surplus_kwh,
        "solar_produced_kwh": energy.total_kwh,
        "solar_consumed_kwh": energy.consumed_kwh,
    }
