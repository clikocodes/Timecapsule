# Time Capsule — Voice Memory Edition

A digital time capsule where a person can leave a message for someone in the future.

Core flow:
Create capsule -> enter sender/receiver -> record voice OR type a note -> optionally transform the voice with Murf AI -> choose unlock date -> seal -> countdown -> future receiver opens it.

## Stack
Frontend: React + Vite, React Router, Framer Motion, Lucide React, browser MediaRecorder API.
Backend: Node.js + Express, MongoDB + Mongoose, Multer, Murf AI.

## Structure
frontend/src/components: Navbar, Countdown, CapsuleCard, VoiceRecorder
frontend/src/pages: Home, CreateCapsule, Capsule, MyCapsules
backend/models: Capsule
backend/routes: capsuleRoutes
backend/services: murf
backend/uploads: local prototype audio

## Run
Backend:
cd backend
npm install
copy .env.example .env
npm run dev

Frontend:
cd frontend
npm install
copy .env.example .env
npm run dev

Backend .env:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
MURF_API_KEY=your_murf_api_key
CLIENT_URL=http://localhost:5173

Frontend .env:
VITE_API_URL=http://localhost:5000/api

## Voice features
1. Record my voice: browser microphone recording, maximum 3 minutes.
2. Keep original recording.
3. Optional Murf Voice Changer: select a Murf voice and pitch/rate.
4. Write instead: Murf Text-to-Speech creates the spoken version for users who prefer typing.

The backend keeps the Murf API key private. Local audio is used for the prototype; production should use Cloudinary/S3 and authentication.

Never commit .env.
