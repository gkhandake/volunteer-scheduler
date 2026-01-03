# Volunteer Scheduler

A user-friendly tool designed to simplify volunteer scheduling for marathon events. This application helps event organizers assign volunteers to specific locations and slots based on their preferences, while ensuring optimal coverage and adherence to organizational constraints.

## Key Features

- **Automated Scheduling**: Fairly distributes volunteers across locations and days.
- **Support for Multiple Volunteers per Desk**: Efficiently manages high-traffic distribution points.
- **Alphabetical Distribution**: Automatically divides participant lookup (A-Z) among available desks.
- **Export to CSV**: Easily download the generated schedule for offline use or printing.
- **Validation**: Ensures each location meets the required volunteer counts (24-40) for safe event operations.

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
(c) gkhandake 2026. All rights reserved.
