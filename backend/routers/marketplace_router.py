from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(tags=["Marketplace"])


@router.get("/listings", response_model=List[schemas.ListingResponse])
def get_listings(db: Session = Depends(get_db)):
    """Get all active energy listings for the marketplace."""
    listings = (
        db.query(models.EnergyListing)
        .filter(models.EnergyListing.is_active == True)
        .order_by(models.EnergyListing.created_at.desc())
        .all()
    )

    result = []
    for listing in listings:
        seller = db.query(models.User).filter(models.User.id == listing.seller_id).first()
        result.append({
            "id": listing.id,
            "seller_name": seller.name if seller and seller.name else f"User #{listing.seller_id}",
            "energy_kwh": listing.energy_kwh,
            "price_per_kwh": listing.price_per_kwh,
            "is_active": listing.is_active,
        })

    return result


@router.post("/listings", response_model=schemas.MessageResponse)
def create_listing(
    req: schemas.CreateListingRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new energy listing (sell energy)."""
    listing = models.EnergyListing(
        seller_id=current_user.id,
        energy_kwh=req.energy_kwh,
        price_per_kwh=req.price_per_kwh,
        is_active=True,
    )
    db.add(listing)
    db.commit()
    return {"message": "Energy listing created successfully"}


@router.post("/buy-energy", response_model=schemas.MessageResponse)
def buy_energy(
    req: schemas.BuyEnergyRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Buy energy from an active listing."""
    listing = (
        db.query(models.EnergyListing)
        .filter(models.EnergyListing.id == req.listing_id, models.EnergyListing.is_active == True)
        .first()
    )

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found or no longer active")

    if listing.seller_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot buy your own energy listing")

    total_cost = listing.energy_kwh * listing.price_per_kwh

    # Check buyer's wallet balance
    buyer_wallet = db.query(models.Wallet).filter(models.Wallet.user_id == current_user.id).first()
    if not buyer_wallet or buyer_wallet.balance < total_cost:
        raise HTTPException(status_code=400, detail="Insufficient wallet balance")

    # Deduct from buyer
    buyer_wallet.balance -= total_cost

    # Credit to seller
    seller_wallet = db.query(models.Wallet).filter(models.Wallet.user_id == listing.seller_id).first()
    if seller_wallet:
        seller_wallet.balance += total_cost

    # Create transaction
    transaction = models.Transaction(
        buyer_id=current_user.id,
        seller_id=listing.seller_id,
        listing_id=listing.id,
        energy_kwh=listing.energy_kwh,
        amount=total_cost,
    )
    db.add(transaction)

    # Mark listing as sold
    listing.is_active = False

    db.commit()
    return {"message": f"Successfully purchased {listing.energy_kwh} kWh for ₹{total_cost}"}
