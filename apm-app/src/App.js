import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'; // 🟦 remplacé Link par NavLink
import RealTimeGraph from './RealTimeGraph';
import TrainingPage from './TrainingPage';
import ChartPage from './ChartPage'; // Nouvelle page pour le graphique complet
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* NAVIGATION BAR */}
        <nav className="navbar">
          <h1>APM Dashboard</h1>
          <div className="nav-links">
            {/* 🟦 remplacé Link par NavLink + logique pour active */}
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              <button>Graphs</button>
            </NavLink>
            <NavLink to="/training" className={({ isActive }) => isActive ? 'active' : ''}>
              <button>Training</button>
            </NavLink>
            <NavLink to="/chart" className={({ isActive }) => isActive ? 'active' : ''}>
              <button>Chart</button>
            </NavLink>
          </div>
        </nav>

        {/* PAGES */}
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