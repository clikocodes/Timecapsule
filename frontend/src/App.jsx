import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateCapsule from "./pages/CreateCapsule";
import Capsule from "./pages/Capsule";
import MyCapsules from "./pages/MyCapsules";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCapsule />} />
          <Route path="/capsule/:capsuleId" element={<Capsule />} />
          <Route path="/my-capsules" element={<MyCapsules />} />
        </Routes>
      </main>
    </div>
  );
}
