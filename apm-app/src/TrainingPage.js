import React, { useState, useEffect } from 'react';

const TrainingPage = () => {
  const [score, setScore] = useState(0); // State to track the user's score
  const [timeLeft, setTimeLeft] = useState(60); // State to track the remaining time (60 seconds)
  const boxes = ['z', 'q', 's', 'd']; // Array of keys for the training game
  const [activeKey, setActiveKey] = useState(''); // State to track the currently active key

  // Timer to count down from 60 seconds
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000); // Decrease time every second
      return () => clearInterval(timer); // Clear the interval when the component unmounts or time runs out
    } else {
      alert(`Game over! Your score: ${score}`); // Alert the user when the game ends
    }
  }, [timeLeft, score]);

  // Randomly select a new active key whenever the score changes
  useEffect(() => {
    setActiveKey(boxes[Math.floor(Math.random() * boxes.length)]); // Pick a random key from the array
  }, [score]);

  // Handle key press events
  const handleKeyPress = (event) => {
    if (event.key === activeKey) {
      setScore((prev) => prev + 1); // Increase the score if the correct key is pressed
    }
  };

  // Add and remove the keydown event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress); // Add event listener for key presses
    return () => window.removeEventListener('keydown', handleKeyPress); // Remove event listener on cleanup
  }, [activeKey]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Keyboard Training</h1>
      <p>Time left: {timeLeft} seconds</p> {/* Display the remaining time */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {boxes.map((key) => (
          <div
            key={key}
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: key === activeKey ? '#e74c3c' : '#3498db', // Highlight the active key in red
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            {key.toUpperCase()} {/* Display the key letter */}
          </div>
        ))}
      </div>
      <p>Score: {score}</p> {/* Display the current score */}
    </div>
  );
};

export default TrainingPage;