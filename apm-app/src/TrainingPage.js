import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainingPage = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [activeKey, setActiveKey] = useState('');
  const [trainingCompleted, setTrainingCompleted] = useState(false); // Track if training is done

  const boxes = ['z', 'q', 's', 'd'];
  const actions = ['Z', 'Q', 'S', 'D', 'Space', 'Click'];

  // Timer to count down from 60 seconds
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setTrainingCompleted(true);
      sendTrainingData(); // Send data when time runs out
    }
  }, [timeLeft]);

  // Randomly select a new active key whenever the score changes
  useEffect(() => {
    if (!trainingCompleted) {
      setActiveKey(boxes[Math.floor(Math.random() * boxes.length)]);
    }
  }, [score, trainingCompleted]);

  // Handle key press events
  const handleKeyPress = (event) => {
    if (event.key === activeKey) {
      setScore((prev) => prev + 1);
      updateActionData(activeKey); // Send action data to the server
    }
  };

  // Send action data to the server
  const updateActionData = async (action) => {
    await axios.post('http://localhost:5000/update_data', { action });
  };

  // Send training data when the training is completed
  const sendTrainingData = async () => {
    await axios.post('http://localhost:5000/update_data', { action: 'Training Complete' });
  };

  // Add and remove the keydown event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeKey]);

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
