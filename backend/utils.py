# (c) gkhandake 2026
import pandas as pd
from io import StringIO
from typing import List
from models import Volunteer

def parse_volunteer_csv(content: str) -> List[Volunteer]:
    df = pd.read_csv(StringIO(content))
    volunteers = []
    
    # Expected columns: name, email, location, slot
    # Drop rows with missing critical information
    df = df.dropna(subset=['name', 'email', 'location', 'slot'])
    
    for _, row in df.iterrows():
        name = str(row['name']).strip()
        email = str(row['email']).strip()
        
        # Skip if critical fields are blank
        if not name or not email:
            continue
            
        volunteers.append(Volunteer(
            name=name,
            email=email,
            location=str(row['location']).strip(),
            slot=str(row['slot']).strip().lower()
        ))
    
    return volunteers
