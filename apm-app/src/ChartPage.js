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
            x: ['Z', 'Q', 'S', 'D'],
            y: [20, 25, 30, 35], // Remplacez ces valeurs par celles réelles
            marker: {
              color: ['green', 'yellow', 'purple', 'orange'],
            },
          },
        ]}
        layout={{
          title: 'Actions Clavier',
          xaxis: { title: 'Actions' },
          yaxis: { title: 'Nombre d\'actions' },
        }}
      />
    </div>
  );
};

export default ChartPage;
