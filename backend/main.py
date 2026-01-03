# (c) gkhandake 2026
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json

from models import SchedulerConfig, FullSchedule
from utils import parse_volunteer_csv
from scheduler import create_schedule

app = FastAPI(title="Volunteer Scheduler API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/schedule", response_model=FullSchedule)
async def generate_schedule(
    locations: str = Form(...),
    days: str = Form(...),
    num_desks: int = Form(...),
    num_vols_per_desk: int = Form(...),
    file: UploadFile = File(...)
):
    try:
        # Parse inputs
        location_list = json.loads(locations)
        day_list = json.loads(days)
        
        # Read CSV file
        content = await file.read()
        volunteers = parse_volunteer_csv(content.decode("utf-8"))
        
        config = SchedulerConfig(
            locations=location_list,
            days=day_list,
            num_desks=num_desks,
            vols_per_desk=num_vols_per_desk
        )
        
        # Generate schedule
        schedule = create_schedule(volunteers, config)
        return schedule
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
