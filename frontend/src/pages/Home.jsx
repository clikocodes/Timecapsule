import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="home-page">

      {/* HERO */}

      <div className="home-hero">

        <div className="home-eyebrow">
          ✦ A MESSAGE FOR ANOTHER TIME ✦
        </div>

        <h1>
          Some words are
          <br />
          <span>meant to wait.</span>
        </h1>

        <p className="hero-subtitle">
          Write it. Speak it. Seal it.
          <br />
          Let time deliver it when the moment is right.
        </p>

        <div className="hero-actions">
          <Link to="/create" className="create-btn">
            Create a Time Capsule
            <span>→</span>
          </Link>

          <Link to="/my-capsules" className="view-btn">
            My Capsules
          </Link>
        </div>

      </div>


      {/* EMOTIONAL EXAMPLES */}

      <div className="message-examples">

        <div className="message-card romantic-card">
          <div className="card-label">
            FOR THE NEXT CHAPTER
          </div>

          <div className="quote-mark">“</div>

          <p>
            To the person you will become —
            <br />
            I hope you never forget who you were
            <br />
            when you first dreamed of this life.
          </p>

          <span className="card-caption">
            — From your younger self
          </span>
        </div>


        <div className="message-card">
          <div className="card-label">
            ACROSS GENERATIONS
          </div>

          <div className="quote-mark">“</div>

          <p>
            One day, when you're older,
            <br />
            I hope you understand how proud
            <br />
            I was of you all along.
          </p>

          <span className="card-caption">
            — From someone who loved you first
          </span>
        </div>

      </div>


      {/* SMALL HOW IT WORKS */}

      <div className="home-footer-message">

        <div className="tiny-line"></div>

        <p>
          A place for the things you wish you could
          <br />
          tell someone years from now.
        </p>

        <span>
          Record your voice or write a message · Choose a future date · Let time do the rest.
        </span>

      </div>

    </section>
  );
}