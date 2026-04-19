from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from enum import Enum
import uuid

app = FastAPI(title="Vendor Management System")

# CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enums
class VendorCategory(str, Enum):
    STAFFING_AGENCY = "Staffing Agency"
    FREELANCE_PLATFORM = "Freelance Platform"
    CONSULTANT = "Consultant"

class VendorStatus(str, Enum):
    PENDING_APPROVAL = "Pending Approval"
    APPROVED = "Approved"

# Models
class VendorCreate(BaseModel):
    name: str
    category: VendorCategory
    contact_email: EmailStr

class Vendor(BaseModel):
    id: str
    name: str
    category: VendorCategory
    contact_email: EmailStr
    status: VendorStatus

# In-memory storage
vendors_db: List[Vendor] = []

@app.get("/")
def read_root():
    return {"message": "Vendor Management System API"}

@app.post("/vendors", response_model=Vendor, status_code=201)
def create_vendor(vendor: VendorCreate):
    """Register a new vendor"""
    # Check if vendor with same email already exists
    if any(v.contact_email == vendor.contact_email for v in vendors_db):
        raise HTTPException(status_code=400, detail="Vendor with this email already exists")
    
    new_vendor = Vendor(
        id=str(uuid.uuid4()),
        name=vendor.name,
        category=vendor.category,
        contact_email=vendor.contact_email,
        status=VendorStatus.PENDING_APPROVAL
    )
    vendors_db.append(new_vendor)
    return new_vendor

@app.get("/vendors", response_model=List[Vendor])
def get_vendors(category: Optional[VendorCategory] = None):
    """Get all vendors, optionally filtered by category"""
    if category:
        return [v for v in vendors_db if v.category == category]
    return vendors_db

@app.patch("/vendors/{vendor_id}/approve", response_model=Vendor)
def approve_vendor(vendor_id: str):
    """Approve a vendor"""
    vendor = next((v for v in vendors_db if v.id == vendor_id), None)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    vendor.status = VendorStatus.APPROVED
    return vendor

@app.delete("/vendors/{vendor_id}")
def delete_vendor(vendor_id: str):
    """Delete a vendor"""
    global vendors_db
    vendor = next((v for v in vendors_db if v.id == vendor_id), None)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    vendors_db = [v for v in vendors_db if v.id != vendor_id]
    return {"message": "Vendor deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Made with Bob
