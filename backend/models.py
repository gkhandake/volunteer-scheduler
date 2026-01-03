# (c) gkhandake 2026
from pydantic import BaseModel, EmailStr
from typing import List, Optional

class Volunteer(BaseModel):
    name: str
    email: str # Using str for simplicity in parsing, can refine later
    location: str
    slot: str  # "first", "second", or "both" (if the user allows)

class SchedulerConfig(BaseModel):
    locations: List[str]
    days: List[str]
    num_desks: int
    vols_per_desk: int

class Assignment(BaseModel):
    desk: int
    alphabet_range: str = ""
    volunteers: List[Volunteer] = []

class SlotAssignment(BaseModel):
    slot_type: str # "first" or "second"
    assignments: List[Assignment]

class DaySchedule(BaseModel):
    day: str
    slots: List[SlotAssignment]

class LocationSchedule(BaseModel):
    location: str
    days: List[DaySchedule]

class FullSchedule(BaseModel):
    schedules: List[LocationSchedule]
