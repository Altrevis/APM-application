import React, { useState, useEffect, useRef, useCallback } from 'react';
import Plot from 'react-plotly.js';

const RealTimeGraph = () => {
  const [data, setData] = useState({
    labels: ["Click", "Space", "Z", "Q", "S", "D"],
    values: [0, 0, 0, 0, 0, 0],
    meanApm: 0,
    medianApm: null
  });

  const [isTraining, setIsTraining] = useState(false);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);  // Le score est réactualisé en temps réel
  const intervalRef = useRef(null);

  // Fonction handleAction avec useCallback pour garantir la stabilité
  const handleAction = useCallback((action) => {
    if (isTraining) {
      setScore((prev) => {
        const newCount = prev + 1;
        const newScore = (newCount / 60).toFixed(2);  // Calculer le score APM en temps réel
        return newScore;
      });
      fetch("http://localhost:5000/update_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
    }
  }, [isTraining]);

  // Fonction generateRandomAction avec useCallback
  const generateRandomAction = useCallback(() => {
    if (!isTraining) return; // Ne génère pas d'action si l'entraînement n'est pas actif
    const actions = ["Z", "Q", "S", "D", "Space", "Click"];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    handleAction(randomAction);
  }, [handleAction, isTraining]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://localhost:5000/get_data")
        .then((response) => response.json())
        .then((data) => {
          setData({
            labels: data.labels,
            values: data.values,
            meanApm: data.mean_apm,
            medianApm: data.median_apm
          });
        })
        .catch((error) => console.error("Erreur de récupération des données :", error));
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const startTraining = () => {
    setIsTraining(true);
    setScore(0);  // Réinitialiser le score au début de l'entraînement
    setTimer(60);

    // Lancer l'intervalle de l'entraînement
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsTraining(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Lancer l'intervalle pour générer des actions toutes les 300ms
    const actionInterval = setInterval(generateRandomAction, 300); 

    return () => clearInterval(actionInterval); // Nettoyer l'intervalle lorsqu'il n'est plus nécessaire
  };

  return (
    <div>
      <h1>Graphiques des Actions Clavier et Souris</h1>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Moyenne APM :</strong> {data.meanApm}</p>
        <p><strong>Médiane APM :</strong> {data.medianApm || 'N/A'}</p>
      </div>
      <Plot
        data={[
          {
            type: 'bar',
            x: data.labels,
            y: data.values,
            marker: {
              color: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
            },
          },
        ]}
        layout={{
          title: 'Actions Clavier et Souris',
          xaxis: { title: 'Actions' },
          yaxis: { title: 'Nombre d\'actions' },
        }}
      />
      {!isTraining ? (
        <button onClick={startTraining} style={{ padding: '10px', marginTop: '20px', backgroundColor: '#4CAF50', color: 'white' }}>
          Démarrer l'entraînement
        </button>
      ) : (
        <div>
          <h2>Temps restant : {timer} s</h2>
          <h2>Score APM : {score}</h2>
        </div>
      )}
    </div>
  );
};

export default RealTimeGraph;
