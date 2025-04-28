import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useNavigate } from 'react-router-dom';
import './RealTimeGraph.css'; // Importez le fichier CSS

const RealTimeGraph = () => {
  const [data, setData] = useState({
    labels: ["Click", "Space", "Z", "Q", "S", "D"],
    values: [0, 0, 0, 0, 0, 0],
    meanApm: 0,
    medianApm: null
  });

  const navigate = useNavigate();

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

  const goToChartPage = () => {
    navigate('/chart');
  };

  return (
    <div className="graph-card">
      <h1 className="graph-title">Graphiques des Actions Clavier et Souris</h1>

      <div className="apm">
        <p><strong>Moyenne APM :</strong> {data.meanApm}</p>
        <p><strong>Médiane APM :</strong> {data.medianApm || 'N/A'}</p>
      </div>

      <div className="plot">
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
            title: {
              text: 'Actions Clavier et Souris',
              font: { color: 'white' }
            },
            paper_bgcolor: 'rgba(0, 0, 0, 0)', 
            plot_bgcolor: 'rgba(0, 0, 0, 0)', 
            font: { color: 'white' }, 
            xaxis: {
              title: 'Actions',
              color: 'white',
              gridcolor: 'rgba(255,255,255,0.1)' 
            },
            yaxis: {
              title: 'Nombre d\'actions',
              color: 'white',
              gridcolor: 'rgba(255,255,255,0.1)'  
            },
            height: 280
          }}
        />
      </div>

      <div className="button-wrapper">
        <button onClick={goToChartPage}>📊 Voir le graphique complet</button>
      </div>
    </div>
  );
};

export default RealTimeGraph;