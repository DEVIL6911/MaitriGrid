from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(tags=["Wallet"])


@router.get("/wallet", response_model=schemas.WalletResponse)
def get_wallet(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the authenticated user's wallet balance."""
    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == current_user.id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return {"balance": wallet.balance}


@router.post("/wallet/topup", response_model=schemas.WalletResponse)
def topup_wallet(
    req: schemas.TopupRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add funds to the user's wallet."""
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == current_user.id).first()
    if not wallet:
        wallet = models.Wallet(user_id=current_user.id, balance=0.0)
        db.add(wallet)

    wallet.balance += req.amount
    db.commit()
    db.refresh(wallet)
    return {"balance": wallet.balance}
