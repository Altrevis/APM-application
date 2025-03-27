import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RealTimeGraph from './RealTimeGraph';
import TrainingPage from './TrainingPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation bar with styled buttons */}
        <nav>
          <Link to="/">
            <button>Graphs</button>
          </Link>
          <Link to="/training">
            <button>Training</button>
          </Link>
        </nav>

        {/* Define routes for the application */}
        <Routes>
          <Route path="/" element={<RealTimeGraph />} />
          <Route path="/training" element={<TrainingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;