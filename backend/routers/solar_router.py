from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/solar", tags=["Solar Integration"])


@router.post("/register", response_model=schemas.MessageResponse)
def register_solar(
    req: schemas.SolarRegisterRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Register solar panel details (model, capacity, meter number)."""
    # Check if user already has a registered device
    existing = db.query(models.SolarDevice).filter(models.SolarDevice.user_id == current_user.id).first()
    if existing:
        # Update existing
        existing.model_number = req.model_number
        existing.capacity = req.capacity
        existing.meter_number = req.meter_number
        db.commit()
        return {"message": "Solar details updated successfully"}

    device = models.SolarDevice(
        user_id=current_user.id,
        model_number=req.model_number,
        capacity=req.capacity,
        meter_number=req.meter_number,
        is_connected=False,
    )
    db.add(device)
    db.commit()
    return {"message": "Solar device registered successfully"}


@router.post("/connect", response_model=schemas.MessageResponse)
def connect_solar(
    req: schemas.SolarConnectRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Connect solar device via QR code scan."""
    device = db.query(models.SolarDevice).filter(models.SolarDevice.user_id == current_user.id).first()
    if not device:
        raise HTTPException(status_code=404, detail="No solar device registered. Please register first.")

    # Demo: any QR code string connects successfully
    device.is_connected = True
    device.connected_at = datetime.utcnow()
    db.commit()
    return {"message": "Solar device connected successfully"}


@router.get("/status", response_model=schemas.SolarStatusResponse)
def get_solar_status(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get solar device connection status."""
    device = db.query(models.SolarDevice).filter(models.SolarDevice.user_id == current_user.id).first()
    if not device:
        return {
            "is_connected": False,
            "model_number": None,
            "capacity": None,
            "meter_number": None,
            "connected_at": None,
        }

    return {
        "is_connected": device.is_connected,
        "model_number": device.model_number,
        "capacity": device.capacity,
        "meter_number": device.meter_number,
        "connected_at": device.connected_at,
    }
