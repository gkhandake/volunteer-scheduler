# Project Architecture

This document provides a high-level overview of the Volunteer Scheduler system's architecture and its directory structure.

## High-Level Architecture

The system follows a decoupled Client-Server architecture, containerized for easy deployment and isolation.

```mermaid
graph TD
    subgraph "Client Side (Browser)"
        ReactApp["React / Vite App"]
        UserInputs["User Inputs (Location, Days, CSV)"]
        ScheduleView["Schedule Dashboard"]
    end

    subgraph "Backend Side (Docker)"
        FastAPI["FastAPI App (Python)"]
        SchedulerLogic["Scheduler Engine"]
        CSVParser["CSV Utility"]
    end

    UserInputs --> ReactApp
    ReactApp -- "POST /schedule (Multipart Form)" --> FastAPI
    FastAPI --> CSVParser
    CSVParser --> SchedulerLogic
    SchedulerLogic --> FastAPI
    FastAPI -- "FullSchedule (JSON)" --> ReactApp
    ReactApp --> ScheduleView
```

## Directory Structure

The project is organized into two main services: `backend` and `frontend`.

---
(c) gkhandake 2026. All rights reserved.
