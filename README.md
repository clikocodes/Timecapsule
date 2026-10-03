# Time Capsule — Voice Memory Edition

A digital time capsule where a person can leave a message for someone in the future.

## Live Website

[Time Capsule — Live Website](YOUR_FRONTEND_DEPLOYED_LINK)

## Core Flow

Create capsule → enter sender and receiver → record a voice message or write a note → optionally transform the voice with Murf AI → choose an unlock date → seal the capsule → countdown → future receiver opens it.

## Stack

### Frontend
- React
- Vite
- React Router
- Framer Motion
- Lucide React
- Browser MediaRecorder API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- Murf AI

## Project Structure

```text
frontend/
└── src/
    ├── components/
    │   ├── Navbar
    │   ├── Countdown
    │   ├── CapsuleCard
    │   └── VoiceRecorder
    │
    └── pages/
        ├── Home
        ├── CreateCapsule
        ├── Capsule
        └── MyCapsules

backend/
├── models/
│   └── Capsule
├── routes/
│   └── capsuleRoutes
├── services/
│   └── murf
└── uploads/
    └── local prototype audio
