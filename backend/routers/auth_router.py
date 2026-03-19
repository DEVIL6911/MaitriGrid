from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=schemas.MessageResponse)
def signup(req: schemas.SignupRequest, db: Session = Depends(get_db)):
    """Register a new user with phone and password."""
    # Check if phone already exists
    existing = db.query(models.User).filter(models.User.phone == req.phone).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )

    user = models.User(
        phone=req.phone,
        password_hash=hash_password(req.password),
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create a wallet for the new user
    wallet = models.Wallet(user_id=user.id, balance=0.0)
    db.add(wallet)
    db.commit()

    return {"message": "OTP sent to your phone number"}


@router.post("/verify", response_model=schemas.TokenResponse)
def verify_otp(req: schemas.OTPVerifyRequest, db: Session = Depends(get_db)):
    """Verify OTP. For demo: any 4-digit OTP is accepted."""
    user = db.query(models.User).filter(models.User.phone == req.phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Demo: accept any 4-digit OTP
    if len(req.otp) != 4 or not req.otp.isdigit():
        raise HTTPException(status_code=400, detail="Invalid OTP format")

    user.is_verified = True
    db.commit()

    token = create_access_token(data={"sub": user.id})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=schemas.TokenResponse)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Login with phone and password, returns JWT token."""
    user = db.query(models.User).filter(models.User.phone == req.phone).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password"
        )

    token = create_access_token(data={"sub": user.id})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/forgot-password", response_model=schemas.MessageResponse)
def forgot_password(req: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Reset password for a user."""
    user = db.query(models.User).filter(models.User.phone == req.phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = hash_password(req.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return current_user
