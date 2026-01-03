# 🏃 Run Volunteer Scheduler

> [!NOTE]
> Created using **Gemini** and **Antigravity**.

A user-friendly tool designed to simplify volunteer scheduling for marathon events. This application helps event organizers assign volunteers to specific locations and slots based on their preferences, while ensuring optimal coverage and adherence to organizational constraints.

## Key Features

- **Edge-to-Edge Dashboard UI**: A premium, fullscreen configuration and results interface with glassmorphism aesthetics.
- **Real-time Efficiency Metrics**: Instantly track coverage percentage, volunteer utilization, and identify staffing gaps (surplus/deficit).
- **Date Range Selection**: Quickly generate schedules for multi-day events using the intuitive range picker and multi-date management.
- **Responsive Div Grid**: A flexible, modern schedule display with side-by-side AM/PM slot comparison for superior readability.
- **Automated Constraint Solving**: Fairly distributes volunteers across locations based on demand and preferences.
- **Dynamic "Empty" Slot Tracking**: Visually flags unfilled positions so organizers can prioritize recruitment efforts.
- **Alphabetical Desk Assignments**: Automatically calculates A-Z lookup ranges for each desk.
- **One-Click CSV Export**: Download the complete distribution plan for offline use and race-day logistics.

## How to Run the Project

This project is containerized using Docker for easy setup and consistency.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

1. Open your terminal in the project's root directory.
2. Run the following command:
   ```bash
   docker compose up --build
   ```
3. Once the containers are running, open your web browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

### Testing with Sample Data

You can use the sample volunteer list provided in the `data/synthetic` folder to test the scheduler's functionality.

---
(c) gkhandake 2026. All rights reserved. Created using **Gemini** and **Antigravity**.
