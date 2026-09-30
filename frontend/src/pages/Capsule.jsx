import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Capsule() {
  const { capsuleId } = useParams();

  const [capsule, setCapsule] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const capsules =
      JSON.parse(localStorage.getItem("timeCapsules")) || [];

    const found = capsules.find(
      (item) => item.id === capsuleId
    );

    setCapsule(found || null);
  }, [capsuleId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!capsule) {
    return (
      <section className="center-page">
        <h1>Capsule not found</h1>

        <Link to="/" className="primary-btn">
          Go Home
        </Link>
      </section>
    );
  }

  const unlockTime = new Date(capsule.unlockDate);
  const difference = unlockTime - now;

  const unlocked = difference <= 0;

  const totalSeconds = Math.max(
    0,
    Math.floor(difference / 1000)
  );

  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  return (
    <section className="capsule-page">
      {!unlocked ? (
        <div className="locked-capsule">
          <div className="lock-icon">🔐</div>

          <div className="hero-badge">
            CAPSULE SEALED
          </div>

          <h1>
            This message is
            <br />
            <span>waiting for you.</span>
          </h1>

          <p>
            A message from{" "}
            <strong>{capsule.senderName}</strong>
          </p>

          <div className="countdown">
            <div>
              <strong>{days}</strong>
              <span>Days</span>
            </div>

            <div>
              <strong>{String(hours).padStart(2, "0")}</strong>
              <span>Hours</span>
            </div>

            <div>
              <strong>{String(minutes).padStart(2, "0")}</strong>
              <span>Minutes</span>
            </div>

            <div>
              <strong>{String(seconds).padStart(2, "0")}</strong>
              <span>Seconds</span>
            </div>
          </div>

          <div className="capsule-info">
            <p>
              <span>For</span>
              {capsule.receiverName}
            </p>

            <p>
              <span>Opens</span>
              {unlockTime.toLocaleString()}
            </p>
          </div>

          <Link to="/my-capsules" className="secondary-btn">
            View My Capsules
          </Link>
        </div>
      ) : (
        <div className="opened-capsule">
          <div className="open-animation">✨</div>

          <div className="hero-badge">
            THE FUTURE HAS ARRIVED
          </div>

          <h1>
            This message
            <br />
            <span>was for you.</span>
          </h1>

          <p>
            From {capsule.senderName} to{" "}
            {capsule.receiverName}
          </p>

          <div className="message-card">
            <h2>{capsule.title}</h2>

            {capsule.messageType === "text" ? (
              <p className="capsule-message">
                {capsule.message}
              </p>
            ) : (
              <div>
                <p className="capsule-message">
                  🎙️ Your recorded voice message
                </p>

                {capsule.audioUrl && (
                  <audio
                    controls
                    src={capsule.audioUrl}
                  />
                )}
              </div>
            )}
          </div>

          <Link to="/" className="primary-btn">
            Create Another Capsule
          </Link>
        </div>
      )}
    </section>
  );
}