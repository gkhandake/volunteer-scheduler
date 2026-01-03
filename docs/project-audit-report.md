# Project Audit and Privacy Report

This document provides a comprehensive list of all tools and libraries used in the Volunteer Scheduler project and confirms the privacy of the processed data.

## Confirmation of Data Privacy

**Data Status: 100% Local and Private**

The Volunteer Scheduler is designed to operate entirely within a localized environment. We confirm that:
1. **No External Transmission**: All input data (e.g., Volunteer CSV files) is processed strictly between the user's web browser and the local backend server.
2. **Local Processing**: Data is never sent to the internet, cloud services, or third-party APIs.
3. **In-Memory Operations**: Volunteer data is processed in-memory for schedule generation and is not stored or shared outside the system.

## Tools and Libraries Audit

Each component used in this project has been inspected for security and privacy compliance.

### Backend (Python)

| Library | Type | License | Commercial Use | Privacy Inspection |
| :--- | :--- | :--- | :--- | :--- |
| **FastAPI** | Web Framework | MIT | Yes | Processes requests locally. No telemetry or data sharing. |
| **Uvicorn** | ASGI Server | BSD-3 | Yes | Standard local server for Python applications. |
| **Pandas** | Data Processing | BSD-3 | Yes | Mathematical and structural data processing. |
| **Pydantic** | Validation | MIT | Yes | Ensures data structure compliance. |
| **python-multipart**| File Handling | Apache 2.0 | Yes | Facilitates the secure upload of CSV files locally. |

### Frontend (JavaScript/React)

| Library | Type | License | Commercial Use | Privacy Inspection |
| :--- | :--- | :--- | :--- | :--- |
| **React** | UI Library | MIT | Yes | Executes entirely within the user's browser. |
| **Vite** | Build Tool | MIT | Yes | Development environment. No runtime data sharing. |
| **Axios** | HTTP Client | MIT | Yes | Communication restricted to the local backend. |
| **Vanilla CSS** | Styling | N/A | Yes | Native browser styling. |

### Infrastructure

| Tool | Type | License | Commercial Use | Privacy Inspection |
| :--- | :--- | :--- | :--- | :--- |
| **Docker** | Containerization | Apache 2.0 | Yes | Provides an isolated environment for the app. |
| **Nginx** | Web Server | BSD-2 | Yes | Serves frontend assets to the browser. |

## Conclusion

The Volunteer Scheduler project utilizes standard, reputable open-source libraries under permissive licenses (MIT, BSD, Apache 2.0). All components are verified as free to use, modify, and distribute, including for commercial purposes. There are no tracking scripts, analytics, or third-party connections integrated into the codebase. Your data remains completely within your control at all times.

---
(c) gkhandake 2026. All rights reserved.
