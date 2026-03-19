from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(tags=["Transactions"])


@router.get("/transactions", response_model=List[schemas.TransactionResponse])
def get_transactions(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get trade history for the current user (both as buyer and seller)."""
    transactions = (
        db.query(models.Transaction)
        .filter(
            (models.Transaction.buyer_id == current_user.id) |
            (models.Transaction.seller_id == current_user.id)
        )
        .order_by(models.Transaction.created_at.desc())
        .all()
    )

    result = []
    for txn in transactions:
        # Show the other party's name
        if txn.buyer_id == current_user.id:
            other_user = db.query(models.User).filter(models.User.id == txn.seller_id).first()
        else:
            other_user = db.query(models.User).filter(models.User.id == txn.buyer_id).first()

        result.append({
            "id": txn.id,
            "user": other_user.name if other_user and other_user.name else f"User #{other_user.id if other_user else 'Unknown'}",
            "energy_kwh": txn.energy_kwh,
            "amount": txn.amount,
            "created_at": txn.created_at,
        })

    return result
