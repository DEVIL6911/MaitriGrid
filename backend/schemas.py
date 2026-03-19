from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ─── Auth Schemas ───

class SignupRequest(BaseModel):
    phone: str
    password: str

class LoginRequest(BaseModel):
    phone: str
    password: str

class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str

class ForgotPasswordRequest(BaseModel):
    phone: str
    new_password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class MessageResponse(BaseModel):
    message: str


# ─── User Schemas ───

class UserResponse(BaseModel):
    id: int
    name: Optional[str] = None
    phone: str
    email: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    age: Optional[int] = None
    aadhaar_number: Optional[str] = None
    is_verified: bool

    class Config:
        from_attributes = True

class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    aadhaar_number: Optional[str] = None


# ─── Energy Schemas ───

class EnergyStatsResponse(BaseModel):
    total_kwh: float
    consumed_kwh: float
    capacity_kwh: float
    surplus_kwh: float
    usage_percent: float

class EnergyHistoryPoint(BaseModel):
    time: str
    kwh: float

class EnergyHistoryResponse(BaseModel):
    total_generated: float
    data: List[EnergyHistoryPoint]


# ─── Marketplace Schemas ───

class ListingResponse(BaseModel):
    id: int
    seller_name: str
    energy_kwh: float
    price_per_kwh: float
    is_active: bool

class CreateListingRequest(BaseModel):
    energy_kwh: float
    price_per_kwh: float

class BuyEnergyRequest(BaseModel):
    listing_id: int


# ─── Transaction Schemas ───

class TransactionResponse(BaseModel):
    id: int
    user: str
    energy_kwh: float
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Wallet Schemas ───

class WalletResponse(BaseModel):
    balance: float

class TopupRequest(BaseModel):
    amount: float


# ─── Solar Schemas ───

class SolarRegisterRequest(BaseModel):
    model_config = {"protected_namespaces": ()}
    model_number: str
    capacity: str
    meter_number: str

class SolarConnectRequest(BaseModel):
    qr_code: str

class SolarStatusResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    is_connected: bool
    model_number: Optional[str] = None
    capacity: Optional[str] = None
    meter_number: Optional[str] = None
    connected_at: Optional[datetime] = None


# ─── Statistics Schemas ───

class StatisticsResponse(BaseModel):
    electricity_saved_percent: float
    total_generated_kwh: float
    total_consumed_kwh: float
    solar_value_kwh: float
    solar_produced_kwh: float
    solar_consumed_kwh: float
