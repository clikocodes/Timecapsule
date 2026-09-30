import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCapsule() {
  const navigate = useNavigate();

  const [messageType, setMessageType] = useState("voice");

  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);

  const [unlockDate, setUnlockDate] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let timer;

    if (recording) {
      timer = setInterval(() => {
        setRecordingTime((time) => time + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [recording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();

      setRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error(error);

      alert(
        "Microphone permission was denied or your microphone is unavailable."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!senderName || !receiverName || !title || !unlockDate) {
      alert("Please fill in all required fields.");
      return;
    }

    if (messageType === "voice" && !audioBlob) {
      alert("Please record your voice first.");
      return;
    }

    if (messageType === "text" && !message.trim()) {
      alert("Please write your message first.");
      return;
    }

    /*
      Prototype-only storage.

      Later we'll replace this with:
      POST /api/capsules
    */

    const capsuleId = crypto.randomUUID();

    const capsule = {
      id: capsuleId,
      senderName,
      receiverName,
      title,
      messageType,
      message,
      unlockDate,
      audioUrl,
      createdAt: new Date().toISOString(),
    };

    const existing =
      JSON.parse(localStorage.getItem("timeCapsules")) || [];

    existing.push(capsule);

    localStorage.setItem(
      "timeCapsules",
      JSON.stringify(existing)
    );

    navigate(`/capsule/${capsuleId}`);
  };

  return (
    <section className="page-container">
      <div className="form-wrapper">
        <div className="page-heading">
          <div className="hero-badge">🔐 CREATE YOUR CAPSULE</div>

          <h1>
            Leave something
            <span> for the future.</span>
          </h1>

          <p>
            Your words, your voice, your memories — sealed until the
            moment they are meant to be heard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="capsule-form">
          <div className="form-section">
            <h2>01 — The people</h2>

            <div className="input-grid">
              <div className="input-group">
                <label>Your name</label>

                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Message for</label>

                <input
                  type="text"
                  placeholder="e.g. Future Me"
                  value={receiverName}
                  onChange={(e) =>
                    setReceiverName(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>02 — The capsule</h2>

            <div className="input-group">
              <label>Capsule title</label>

              <input
                type="text"
                placeholder="A message from 2026..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <h2>03 — Your message</h2>

            <div className="message-switcher">
              <button
                type="button"
                className={
                  messageType === "voice"
                    ? "switch active"
                    : "switch"
                }
                onClick={() => setMessageType("voice")}
              >
                🎙️ Record Voice
              </button>

              <button
                type="button"
                className={
                  messageType === "text"
                    ? "switch active"
                    : "switch"
                }
                onClick={() => setMessageType("text")}
              >
                ✍️ Write Message
              </button>
            </div>

            {messageType === "voice" ? (
              <div className="voice-recorder">
                <div className="mic-circle">
                  {recording ? "🔴" : "🎙️"}
                </div>

                <h3>
                  {recording
                    ? "Recording your message..."
                    : "Record your voice"}
                </h3>

                <div className="recording-time">
                  {formatTime(recordingTime)}
                </div>

                {!recording && !audioUrl && (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={startRecording}
                  >
                    Start Recording
                  </button>
                )}

                {recording && (
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={stopRecording}
                  >
                    Stop Recording
                  </button>
                )}

                {audioUrl && !recording && (
                  <div className="audio-preview">
                    <p>Your recording:</p>

                    <audio
                      controls
                      src={audioUrl}
                    />

                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => {
                        setAudioUrl("");
                        setAudioBlob(null);
                        setRecordingTime(0);
                      }}
                    >
                      Record Again
                    </button>
                  </div>
                )}

                <p className="helper-text">
                  Your voice stays at the heart of the capsule.
                  Murf AI can be added later to transform it.
                </p>
              </div>
            ) : (
              <div className="text-message-box">
                <textarea
                  rows="8"
                  placeholder="Write something your future self or loved one should hear..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <p className="helper-text">
                  Murf AI can convert your written message into
                  natural-sounding speech.
                </p>
              </div>
            )}
          </div>

          <div className="form-section">
            <h2>04 — Unlock date</h2>

            <div className="input-group">
              <label>When should this message be opened?</label>

              <input
                type="datetime-local"
                value={unlockDate}
                onChange={(e) =>
                  setUnlockDate(e.target.value)
                }
              />
            </div>
          </div>

          <button type="submit" className="seal-button">
            🔐 Seal My Time Capsule
          </button>
        </form>
      </div>
    </section>
  );
}