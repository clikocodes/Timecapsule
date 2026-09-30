import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyCapsules() {
  const [capsules, setCapsules] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("timeCapsules");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setCapsules(parsed);
        } else {
          setCapsules([]);
        }
      } else {
        setCapsules([]);
      }
    } catch (error) {
      console.error("Could not load capsules:", error);
      setCapsules([]);
    }
  }, []);

  const deleteCapsule = (id) => {
    const updatedCapsules = capsules.filter(
      (capsule) => capsule.id !== id
    );

    setCapsules(updatedCapsules);

    localStorage.setItem(
      "timeCapsules",
      JSON.stringify(updatedCapsules)
    );
  };

  return (
    <section className="page-container">
      <div className="page-heading">
        <div className="hero-badge">
          🗃️ YOUR CAPSULES
        </div>

        <h1>
          Messages you've
          <span> sent through time.</span>
        </h1>

        <p>
          Every time capsule you create will appear here.
        </p>
      </div>

      {capsules.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>

          <h2>No capsules yet</h2>

          <p>
            You haven't created a time capsule yet.
          </p>

          <Link
            to="/create"
            className="primary-btn"
          >
            Create My First Capsule
          </Link>
        </div>
      ) : (
        <div className="capsule-grid">
          {capsules.map((capsule) => {
            const unlockDate = new Date(capsule.unlockDate);
            const isUnlocked =
              !isNaN(unlockDate.getTime()) &&
              unlockDate <= new Date();

            return (
              <div
                className="capsule-card"
                key={capsule.id}
              >
                <div className="card-top">
                  <span>
                    {isUnlocked
                      ? "✨ Opened"
                      : "🔐 Sealed"}
                  </span>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      deleteCapsule(capsule.id)
                    }
                  >
                    ×
                  </button>
                </div>

                <h2>
                  {capsule.title || "Untitled Capsule"}
                </h2>

                <p>
                  For{" "}
                  <strong>
                    {capsule.receiverName ||
                      "Someone special"}
                  </strong>
                </p>

                <p>
                  From{" "}
                  <strong>
                    {capsule.senderName || "You"}
                  </strong>
                </p>

                <p className="date-text">
                  Opens:{" "}
                  {isNaN(unlockDate.getTime())
                    ? "Date not available"
                    : unlockDate.toLocaleString()}
                </p>

                <Link
                  to={`/capsule/${capsule.id}`}
                  className="secondary-btn"
                >
                  View Capsule
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}