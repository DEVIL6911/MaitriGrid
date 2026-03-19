from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(tags=["User Profile"])


@router.get("/user", response_model=schemas.UserResponse)
def get_user_profile(current_user: models.User = Depends(get_current_user)):
    """Get the authenticated user's profile."""
    return current_user


@router.put("/user", response_model=schemas.UserResponse)
def update_user_profile(
    req: schemas.UserUpdateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile fields (name, email, phone, gender, dob, aadhaar)."""
    if req.name is not None:
        current_user.name = req.name
    if req.email is not None:
        current_user.email = req.email
    if req.phone is not None:
        current_user.phone = req.phone
    if req.gender is not None:
        current_user.gender = req.gender
    if req.dob is not None:
        current_user.dob = req.dob
    if req.aadhaar_number is not None:
        current_user.aadhaar_number = req.aadhaar_number

    db.commit()
    db.refresh(current_user)
    return current_user
