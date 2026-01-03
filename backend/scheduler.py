# (c) gkhandake 2026
from typing import List, Dict, Set
from models import Volunteer, SchedulerConfig, FullSchedule, LocationSchedule, DaySchedule, SlotAssignment, Assignment
import random

def create_schedule(volunteers: List[Volunteer], config: SchedulerConfig) -> FullSchedule:
    # Shuffle volunteers to ensure fairness
    random.shuffle(volunteers)
    
    # Track assigned volunteers to ensure no repetition
    assigned_volunteer_emails: Set[str] = set()
    
    full_schedule_data = []

    for location in config.locations:
        location_schedule = LocationSchedule(location=location, days=[])
        
        for day in config.days:
            day_schedule = DaySchedule(day=day, slots=[])
            
            for slot_type in ["first", "second"]:
                slot_assignment = SlotAssignment(slot_type=slot_type, assignments=[])
                
                # Filter volunteers matching this location and slot who haven't been assigned yet
                eligible_volunteers = [
                    v for v in volunteers 
                    if v.location.lower() == location.lower() and v.slot.lower() == slot_type.lower() and v.email not in assigned_volunteer_emails
                ]
                
                # Calculate alphabet ranges for desks
                alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                letters_per_desk = len(alphabet) // config.num_desks
                remainder = len(alphabet) % config.num_desks
                
                ranges = []
                start_ptr = 0
                for i in range(config.num_desks):
                    end_ptr = start_ptr + letters_per_desk + (1 if i < remainder else 0)
                    ranges.append(f"{alphabet[start_ptr]}-{alphabet[end_ptr-1]}")
                    start_ptr = end_ptr

                for desk_idx in range(1, config.num_desks + 1):
                    assigned_vols = []
                    for _ in range(config.vols_per_desk):
                        if eligible_volunteers:
                            assigned_vol = eligible_volunteers.pop(0)
                            assigned_volunteer_emails.add(assigned_vol.email)
                            assigned_vols.append(assigned_vol)
                    
                    slot_assignment.assignments.append(
                        Assignment(
                            desk=desk_idx, 
                            alphabet_range=ranges[desk_idx-1],
                            volunteers=assigned_vols
                        )
                    )
                
                day_schedule.slots.append(slot_assignment)
            
            location_schedule.days.append(day_schedule)
        
        full_schedule_data.append(location_schedule)
    
    return FullSchedule(schedules=full_schedule_data)
