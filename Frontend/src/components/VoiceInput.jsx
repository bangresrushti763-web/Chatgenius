import React, { useState, useEffect } from "react";

const VoiceInput = ({ onTranscript }) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Your browser does not support speech recognition");
      return;
    }
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";

    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onTranscript(transcript);
    };

    recog.onend = () => setListening(false);
    setRecognition(recog);
  }, [onTranscript]);

  const startListening = () => {
    if (recognition) {
      setListening(true);
      recognition.start();
    }
  };

  return (
    <button 
      onClick={startListening} 
      className={`voice-input-button ${listening ? 'listening' : ''}`}
      aria-label={listening ? "Listening..." : "Voice input"}
    >
      <i className={`fa-solid fa-microphone${listening ? '-slash' : ''}`}></i>
      {listening && <span className="listening-text">Listening...</span>}
    </button>
  );
};

export default VoiceInput;