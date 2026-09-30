import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function CreateCapsule() {
  const navigate = useNavigate();

  // -----------------------------
  // BASIC CAPSULE DATA
  // -----------------------------
  const [messageType, setMessageType] = useState("voice");

  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState("");

  // -----------------------------
  // VOICE RECORDING
  // -----------------------------
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // -----------------------------
  // MURF SETTINGS
  // -----------------------------
  const [voiceId, setVoiceId] = useState("Natalie");
  const [pitch, setPitch] = useState(0);
  const [rate, setRate] = useState(0);

  const [useMurf, setUseMurf] = useState(true);

  // -----------------------------
  // SUBMIT / LOADING
  // -----------------------------
  const [submitting, setSubmitting] = useState(false);

  // -----------------------------
  // RECORDING TIMER
  // -----------------------------
  useEffect(() => {
    let timer;

    if (recording) {
      timer = setInterval(() => {
        setRecordingTime((time) => time + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [recording]);

  // -----------------------------
  // START RECORDING
  // -----------------------------
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

  // -----------------------------
  // STOP RECORDING
  // -----------------------------
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // -----------------------------
  // RECORDING TIME
  // -----------------------------
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // -----------------------------
  // RESET RECORDING
  // -----------------------------
  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioUrl("");
    setAudioBlob(null);
    setRecordingTime(0);
  };

  // -----------------------------
  // CREATE CAPSULE
  // -----------------------------
  const handleSubmit = async (event) => {
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

    setSubmitting(true);

    try {
      let response;

      // =====================================================
      // TEXT MESSAGE → MURF TEXT TO SPEECH
      // =====================================================
      if (messageType === "text") {
        response = await fetch(`${API_URL}/api/capsules/text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            senderName,
            recipientName: receiverName,
            message,
            unlockDate,
            voiceId,
            pitch,
            rate,
          }),
        });
      }

      // =====================================================
      // RECORDED VOICE → OPTIONAL MURF VOICE CHANGER
      // =====================================================
      else {
        const formData = new FormData();

        formData.append("audio", audioBlob, "recording.webm");

        formData.append("title", title);
        formData.append("senderName", senderName);
        formData.append("recipientName", receiverName);
        formData.append("unlockDate", unlockDate);

        formData.append("voiceId", voiceId);
        formData.append("pitch", String(pitch));
        formData.append("rate", String(rate));
        formData.append("useMurf", String(useMurf));

        response = await fetch(`${API_URL}/api/capsules/voice`, {
          method: "POST",
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Something went wrong while creating the capsule."
        );
      }

      console.log("Capsule created:", data);

      // Backend generates the real capsule ID
      navigate(`/capsule/${data.capsuleId}`);
    } catch (error) {
      console.error("Capsule creation failed:", error);

      alert(
        error.message ||
          "Could not create your capsule. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-container">
      <div className="form-wrapper">

        {/* =========================================
            HEADING
        ========================================== */}
        <div className="page-heading">
          <div className="hero-badge">
            🔐 CREATE YOUR CAPSULE
          </div>

          <h1>
            Leave something
            <span> for the future.</span>
          </h1>

          <p>
            Your words, your voice, your memories — sealed until
            the moment they are meant to be heard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="capsule-form">

          {/* =========================================
              01 — PEOPLE
          ========================================== */}
          <div className="form-section">
            <h2>01 — The people</h2>

            <div className="input-grid">

              <div className="input-group">
                <label>Your name</label>

                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={senderName}
                  onChange={(e) =>
                    setSenderName(e.target.value)
                  }
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

          {/* =========================================
              02 — CAPSULE
          ========================================== */}
          <div className="form-section">
            <h2>02 — The capsule</h2>

            <div className="input-group">
              <label>Capsule title</label>

              <input
                type="text"
                placeholder="A message from 2026..."
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />
            </div>
          </div>

          {/* =========================================
              03 — MESSAGE
          ========================================== */}
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

            {/* =====================================
                VOICE MODE
            ====================================== */}
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
                      onClick={resetRecording}
                    >
                      Record Again
                    </button>

                  </div>
                )}

                {/* MURF SETTINGS */}
                <div className="murf-settings">

                  <h3>
                    ✨ Voice transformation
                  </h3>

                  <p className="helper-text">
                    Give your recorded voice a different character
                    using Murf AI.
                  </p>

                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={useMurf}
                      onChange={(e) =>
                        setUseMurf(e.target.checked)
                      }
                    />

                    <span>
                      Use Murf AI voice transformation
                    </span>
                  </label>

                  {useMurf && (
                    <div className="input-grid">

                      <div className="input-group">
                        <label>Voice</label>

                        <select
                          value={voiceId}
                          onChange={(e) =>
                            setVoiceId(e.target.value)
                          }
                        >
                          <option value="Natalie">
                            Natalie
                          </option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label>
                          Pitch: {pitch}
                        </label>

                        <input
                          type="range"
                          min="-50"
                          max="50"
                          value={pitch}
                          onChange={(e) =>
                            setPitch(Number(e.target.value))
                          }
                        />
                      </div>

                      <div className="input-group">
                        <label>
                          Speed: {rate}
                        </label>

                        <input
                          type="range"
                          min="-50"
                          max="50"
                          value={rate}
                          onChange={(e) =>
                            setRate(Number(e.target.value))
                          }
                        />
                      </div>

                    </div>
                  )}

                </div>

                <p className="helper-text">
                  Your voice becomes part of the memory —
                  preserved for the moment it is meant to be heard.
                </p>

              </div>
            ) : (

              /* =====================================
                 TEXT MODE
              ====================================== */

              <div className="text-message-box">

                <textarea
                  rows="8"
                  placeholder="Write something your future self or someone you love should hear..."
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                />

                {/* MURF TEXT TO SPEECH */}
                <div className="murf-settings">

                  <h3>
                    ✨ Give your words a voice
                  </h3>

                  <p className="helper-text">
                    Murf AI will turn your written message
                    into a natural voice for your future capsule.
                  </p>

                  <div className="input-grid">

                    <div className="input-group">
                      <label>Voice</label>

                      <select
                        value={voiceId}
                        onChange={(e) =>
                          setVoiceId(e.target.value)
                        }
                      >
                        <option value="Natalie">
                          Natalie
                        </option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>
                        Pitch: {pitch}
                      </label>

                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={pitch}
                        onChange={(e) =>
                          setPitch(Number(e.target.value))
                        }
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Speed: {rate}
                      </label>

                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={rate}
                        onChange={(e) =>
                          setRate(Number(e.target.value))
                        }
                      />
                    </div>

                  </div>

                </div>

              </div>
            )}
          </div>

          {/* =========================================
              04 — UNLOCK DATE
          ========================================== */}
          <div className="form-section">
            <h2>04 — Unlock date</h2>

            <div className="input-group">

              <label>
                When should this message be opened?
              </label>

              <input
                type="datetime-local"
                value={unlockDate}
                onChange={(e) =>
                  setUnlockDate(e.target.value)
                }
              />

            </div>
          </div>

          {/* =========================================
              SUBMIT
          ========================================== */}
          <button
            type="submit"
            className="seal-button"
            disabled={submitting}
          >
            {submitting
              ? "⏳ Sealing your capsule..."
              : "🔐 Seal My Time Capsule"}
          </button>

        </form>
      </div>
    </section>
  );
}