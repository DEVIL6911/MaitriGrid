from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=True)
    phone = Column(String(15), unique=True, index=True, nullable=False)
    email = Column(String(100), nullable=True)
    password_hash = Column(String(255), nullable=False)
    gender = Column(String(10), nullable=True)
    dob = Column(String(15), nullable=True)
    age = Column(Integer, nullable=True)
    aadhaar_number = Column(String(12), nullable=True)  # 12-digit Aadhaar
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    listings = relationship("EnergyListing", back_populates="seller")
    solar_devices = relationship("SolarDevice", back_populates="user")
    wallet = relationship("Wallet", back_populates="user", uselist=False)
    energy_data = relationship("EnergyData", back_populates="user")


class EnergyListing(Base):
    __tablename__ = "energy_listings"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    energy_kwh = Column(Float, nullable=False)
    price_per_kwh = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    seller = relationship("User", back_populates="listings")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("energy_listings.id"), nullable=True)
    energy_kwh = Column(Float, nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])


class SolarDevice(Base):
    __tablename__ = "solar_devices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    model_number = Column(String(100), nullable=False)
    capacity = Column(String(50), nullable=False)  # e.g. "5kW"
    meter_number = Column(String(100), nullable=False)
    is_connected = Column(Boolean, default=False)
    connected_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="solar_devices")


class EnergyData(Base):
    __tablename__ = "energy_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_kwh = Column(Float, default=0.0)
    consumed_kwh = Column(Float, default=0.0)
    capacity_kwh = Column(Float, default=0.0)
    surplus_kwh = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="energy_data")


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    balance = Column(Float, default=0.0)

    user = relationship("User", back_populates="wallet")
