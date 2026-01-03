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
        location_list = [loc.strip() for loc in json.loads(locations)]
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
        
        # Calculate Metrics
        total_vols_available = len(volunteers)
        total_slots_to_fill = len(config.locations) * len(config.days) * 2 * config.num_desks * config.vols_per_desk
        assigned_count = 0
        unfilled_capacity = 0
        
        for loc_sched in schedule.schedules:
            for day_sched in loc_sched.days:
                for slot_sched in day_sched.slots:
                    for asgn in slot_sched.assignments:
                        assigned_count += len(asgn.volunteers)
        
        unfilled_capacity = total_slots_to_fill - assigned_count
        surplus = total_vols_available - assigned_count
        coverage = (assigned_count / total_slots_to_fill * 100) if total_slots_to_fill > 0 else 100
        
        from models import ScheduleMetrics
        schedule.metrics = ScheduleMetrics(
            total_volunteers_available=total_vols_available,
            total_slots_to_fill=total_slots_to_fill,
            assigned_volunteers_count=assigned_count,
            unassigned_slots_count=unfilled_capacity,
            surplus_volunteers_count=max(0, surplus),
            coverage_percentage=round(coverage, 1)
        )
        
        return schedule
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
