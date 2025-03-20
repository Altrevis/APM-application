import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const RealTimeGraph = () => {
  const [data, setData] = useState({
    labels: ["Click", "Space", "Z", "Q", "S", "D"],
    values: [0, 0, 0, 0, 0, 0],
    meanApm: 0,
    medianApm: null
  });

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
    </div>
  );
};

export default RealTimeGraph;
