# (c) gkhandake 2026
import pandas as pd
from io import StringIO
from typing import List
from models import Volunteer

def parse_volunteer_csv(content: str) -> List[Volunteer]:
    df = pd.read_csv(StringIO(content))
    volunteers = []
    
    # Expected columns: name, email, location, slot
    for _, row in df.iterrows():
        volunteers.append(Volunteer(
            name=str(row['name']),
            email=str(row['email']),
            location=str(row['location']),
            slot=str(row['slot'])
        ))
    
    return volunteers
