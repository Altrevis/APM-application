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
  const [score, setScore] = useState(0);
  const [actionCount, setActionCount] = useState(0);  // Compteur d'actions
  const intervalRef = useRef(null);

  const handleAction = useCallback((action) => {
    if (isTraining) {
      setActionCount((prevCount) => prevCount + 1);
      const currentScore = ((actionCount + 1) / (60 - timer)).toFixed(2);
      setScore(currentScore);
    }
  
    // Envoi des données après l'entraînement
    if (!isTraining) {
      fetch("http://localhost:5000/update_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
    }
  }, [isTraining, timer, actionCount]);  

  const generateRandomAction = useCallback(() => {
    if (!isTraining) return;
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
    setActionCount(0);  // Réinitialiser le compteur d'actions

    // Lancer l'intervalle de l'entraînement
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsTraining(false); // Fin de l'entraînement, réactive les graphiques
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Lancer l'intervalle pour générer des actions toutes les 300ms
    const actionInterval = setInterval(generateRandomAction, 300);

    return () => clearInterval(actionInterval); // Nettoyer l'intervalle
  };

  return (
    <div>
      <h1>Graphiques des Actions Clavier et Souris</h1>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Moyenne APM :</strong> {data.meanApm}</p>
        <p><strong>Médiane APM :</strong> {data.medianApm || 'N/A'}</p>
      </div>

      {/* Afficher le graphique seulement si l'entraînement est terminé */}
      {!isTraining && (
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
      )}

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

      {/* Afficher le score une fois l'entraînement terminé */}
      {!isTraining && <p><strong>Score Final :</strong> {score}</p>}
    </div>
  );
};

export default RealTimeGraph;
