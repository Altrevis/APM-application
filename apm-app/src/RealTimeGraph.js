import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate

const RealTimeGraph = () => {
  const [data, setData] = useState({
    labels: ["Click", "Space", "Z", "Q", "S", "D"],
    values: [0, 0, 0, 0, 0, 0],
    meanApm: 0,
    medianApm: null
  });

  const navigate = useNavigate(); // Utilisez useNavigate pour la navigation

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

  // Fonction pour rediriger vers la page des graphiques complets
  const goToChartPage = () => {
    navigate('/chart');
  };

  return (
    <div>
      <h1>Graphiques des Actions Clavier et Souris</h1>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Moyenne APM :</strong> {data.meanApm}</p>
        <p><strong>Médiane APM :</strong> {data.medianApm || 'N/A'}</p>
      </div>

      {/* Afficher le graphique uniquement si l'entraînement est terminé */}
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

      {/* Bouton pour rediriger vers le graphique complet */}
      <button onClick={goToChartPage}>Voir le graphique complet</button>
    </div>
  );
};

export default RealTimeGraph;
