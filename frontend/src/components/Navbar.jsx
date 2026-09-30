import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        ⏳ TimeCapsule
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/create">Create Capsule</Link>
        <Link to="/my-capsules">My Capsules</Link>
      </div>
    </nav>
  );
}