"""
Seed script – populates the database with demo data matching the frontend's dummy data.
Run automatically on first startup if the users table is empty.
"""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from auth import hash_password
import models


def seed_database(db: Session):
    """Seed the database with demo users, listings, transactions, and energy data."""

    # Check if data already exists
    if db.query(models.User).first():
        return  # Already seeded

    print("[SEED] Seeding database with demo data...")

    # ─── Demo Users ───
    users_data = [
        {"name": "Ayush Gupta", "phone": "9876543210", "email": "guptaop3449@gmail.com",
         "gender": "Male", "dob": "11-01-2005", "age": 20, "aadhaar_number": "123456789012"},
        {"name": "Ved Chansoriya", "phone": "9876543211", "email": "ved@example.com",
         "gender": "Male", "dob": "15-03-2004", "age": 21, "aadhaar_number": "234567890123"},
        {"name": "Priya Sharma", "phone": "9876543212", "email": "priya@example.com",
         "gender": "Female", "dob": "22-07-2003", "age": 22, "aadhaar_number": "345678901234"},
        {"name": "Rahul Verma", "phone": "9876543213", "email": "rahul@example.com",
         "gender": "Male", "dob": "08-11-2002", "age": 23, "aadhaar_number": "456789012345"},
        {"name": "Astha Gupta", "phone": "9876543214", "email": "astha@example.com",
         "gender": "Female", "dob": "19-05-2004", "age": 21, "aadhaar_number": "567890123456"},
    ]

    users = []
    for udata in users_data:
        user = models.User(
            name=udata["name"],
            phone=udata["phone"],
            email=udata["email"],
            password_hash=hash_password("password123"),
            gender=udata["gender"],
            dob=udata["dob"],
            age=udata["age"],
            aadhaar_number=udata["aadhaar_number"],
            is_verified=True,
        )
        db.add(user)
        users.append(user)

    db.commit()
    for u in users:
        db.refresh(u)

    # ─── Wallets ───
    wallets_data = [5000.0, 3200.0, 4100.0, 2800.0, 3500.0]
    for i, user in enumerate(users):
        wallet = models.Wallet(user_id=user.id, balance=wallets_data[i])
        db.add(wallet)
    db.commit()

    # ─── Energy Listings (matching frontend ENERGY_LISTINGS) ───
    listings_data = [
        {"seller_idx": 0, "energy_kwh": 12.5, "price_per_kwh": 400},
        {"seller_idx": 1, "energy_kwh": 12.5, "price_per_kwh": 400},
        {"seller_idx": 2, "energy_kwh": 12.5, "price_per_kwh": 400},
        {"seller_idx": 3, "energy_kwh": 8.2, "price_per_kwh": 320},
    ]

    for ldata in listings_data:
        listing = models.EnergyListing(
            seller_id=users[ldata["seller_idx"]].id,
            energy_kwh=ldata["energy_kwh"],
            price_per_kwh=ldata["price_per_kwh"],
            is_active=True,
        )
        db.add(listing)
    db.commit()

    # ─── Sample Transactions (matching frontend TRADE_HISTORY) ───
    txns_data = [
        {"buyer_idx": 1, "seller_idx": 0, "energy_kwh": 5.0, "amount": 400},
        {"buyer_idx": 2, "seller_idx": 1, "energy_kwh": 3.5, "amount": 400},
        {"buyer_idx": 0, "seller_idx": 4, "energy_kwh": 4.0, "amount": 400},
    ]

    for tdata in txns_data:
        txn = models.Transaction(
            buyer_id=users[tdata["buyer_idx"]].id,
            seller_id=users[tdata["seller_idx"]].id,
            energy_kwh=tdata["energy_kwh"],
            amount=tdata["amount"],
        )
        db.add(txn)
    db.commit()

    # ─── Energy Data (time-series for dashboard chart) ───
    now = datetime.utcnow()
    time_points = [
        (1, 20), (5, 45), (9, 28), (13, 80), (17, 99), (21, 43),
    ]

    for user in users:
        for hour_offset, kwh_value in time_points:
            ts = now.replace(hour=hour_offset, minute=0, second=0, microsecond=0)
            energy = models.EnergyData(
                user_id=user.id,
                total_kwh=kwh_value,
                consumed_kwh=kwh_value * 0.78,
                capacity_kwh=42.0,
                surplus_kwh=kwh_value * 0.22,
                timestamp=ts,
            )
            db.add(energy)
    db.commit()

    # ─── Solar Device for Ayush ───
    solar = models.SolarDevice(
        user_id=users[0].id,
        model_number="SP-5000X",
        capacity="5kW",
        meter_number="MTR-2024-001",
        is_connected=True,
        connected_at=now,
    )
    db.add(solar)
    db.commit()

    print("[SEED] Database seeded successfully!")
    print(f"   - {len(users)} users (password: password123)")
    print(f"   - {len(listings_data)} energy listings")
    print(f"   - {len(txns_data)} transactions")
    print(f"   - {len(time_points) * len(users)} energy data points")
