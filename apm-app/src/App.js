import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RealTimeGraph from './RealTimeGraph';
import TrainingPage from './TrainingPage';
import ChartPage from './ChartPage'; // Nouvelle page pour le graphique complet
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
          <Link to="/chart">
            <button>Graphique Complet</button>
          </Link>
        </nav>

        {/* Define routes for the application */}
        <Routes>
          <Route path="/" element={<RealTimeGraph />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/chart" element={<ChartPage />} /> {/* Nouvelle route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
