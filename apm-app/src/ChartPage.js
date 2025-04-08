import React from 'react';
import Plot from 'react-plotly.js';

const ChartPage = () => {
  return (
    <div>
      <h1>Graphique Complet</h1>
      <Plot
        data={[
          {
            type: 'bar',
            x: ['Click', 'Space', 'Z', 'Q', 'S', 'D'],
            y: [10, 15, 20, 25, 30, 35], // Remplacez ces valeurs par celles réelles
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

export default ChartPage;
