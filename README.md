# SheepTrack

> **Virtual Pet Productivity Tracker App**  
Helping people accomplish their goals with a virtual pet.
---

## Overview
**SheepTrack** is a productivity app that motivates users to complete daily goals by caring for a virtual sheep. The sheep's mood and health reflect the user's progress: it is happy when goals are completed and sick when goals are missed.

---

## Repo Structure
```
TheMCS/
|
|-- backend/
|   |-- prisma/
|       -> Prisma schema, migrations, and database client setup
|   |-- src/routes/
|       |-- authRoutes.js    -> handles authentication-related API endpoints
|       |-- userRoutes.js    -> handles normal user-specific actions
|   |-- goalRoutes.js        -> API routes for managing user goals
|   |-- package.json         -> backend dependencies and scripts
|   |-- package-lock.json    -> locks exact dependency versions
|   |-- server.js            -> backend entry point; sets up Express server and routes
|
|-- frontend/
|   |-- public/              -> static assets (images, icons, background)
|   |-- src/
|       |-- assets/           -> importable static assets for React components
|       |-- App.jsx           -> main root component
|       |-- App.css           -> global styling
|       |-- Goal.jsx          -> displays and manages individual goals
|       |-- GoalArchive.jsx   -> generic styled scrollable content area
|       |-- Tracker.jsx       -> handles countdowns and progress tracking
|       |-- index.css         -> base/global CSS
|       |-- login.jsx         -> login page component
|       |-- login.css         -> login page styling
|       |-- main.jsx          -> React + Vite entry point
|       |-- sheep.jsx         -> UI component for the virtual sheep
|   |-- standard config files -> dependencies, formatting, and build configs
|
|-- README.md

```
## Note
```
SheepTrack uses a private database for demo purposes. Cloning this repository enables you to run the frontend and backend locally, however, the app will not have access to live user data. To test the full functionality, you would need to configure your own database and update the connection string in the .env file.
