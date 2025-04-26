import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainingPage = () => {
  const [sessionId, setSessionId] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [activeKey, setActiveKey] = useState('');
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [keyScores, setKeyScores] = useState({ z: 0, q: 0, s: 0, d: 0 });
  const boxes = React.useMemo(() => ['z', 'q', 's', 'd'], []);

  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await axios.post('http://localhost:5000/start_training_session');
        setSessionId(response.data.session_id);
      } catch (error) {
        console.error("Erreur lors de la création de la session:", error);
      }
    };
    createSession();
  }, []);
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setTrainingCompleted(true);
      sendTrainingData();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!trainingCompleted) {
      setActiveKey(boxes[Math.floor(Math.random() * boxes.length)]);
    }
  }, [boxes, score, trainingCompleted]);

  const handleKeyPress = React.useCallback((event) => {
    if (event.key === activeKey) {
      setScore((prev) => prev + 1);
      setKeyScores((prev) => ({
        ...prev,
        [activeKey]: prev[activeKey] + 1,
      }));
      updateActionData(activeKey);
    }
  }, [activeKey]);

  const updateActionData = async (action) => {
    await axios.post('http://localhost:5000/update_data', { action });
  };

  const sendTrainingData = async () => {
    if (sessionId) {
      await axios.post('http://localhost:5000/save_training_results_with_session', {
        session_id: sessionId,
        results: keyScores,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Keyboard Training</h1>
      <p>Time left: {timeLeft} seconds</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {boxes.map((key) => (
          <div
            key={key}
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: key === activeKey ? '#e74c3c' : '#3498db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            {key.toUpperCase()}
          </div>
        ))}
      </div>
      <p>Score: {score}</p>
      {trainingCompleted && <p>Training completed. Your score: {score}</p>}
    </div>
  );
};

export default TrainingPage;