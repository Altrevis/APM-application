import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import './chartPage.css';

const ChartPage = () => {
  const [yData] = useState([12, 9, 18, 22, 26, 31, 34]);

  return (
    <div className="chart-container">
      <div className="chart-card">
        <h1 className="chart-title">Graphique complet</h1>

        <Plot
          data={[
            {
              type: 'bar',
              x: ['Click Gauche', 'Click Droit', 'Espace', 'Z', 'Q', 'S', 'D'],
              y: yData,
              marker: {
                color: ['red', 'gray', 'blue', 'green', 'yellow', 'purple', 'orange'],
              },
              hovertemplate: '%{x}<br><b>%{y} actions</b><extra></extra>',
              hoverlabel: {
                bgcolor: 'rgba(255,255,255,0.2)',
                bordercolor: 'white',
                font: { color: 'white' }
              }
            }
          ]}
          layout={{
            title: {
              text: 'Fréquence des Actions',
              font: { color: 'white', size: 16 },
              x: 0.5,
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: { title: 'Actions', color: 'white' },
            yaxis: { title: 'Nombre d\'actions', color: 'white' },
            margin: { t: 60, b: 50 }
          }}
          config={{ responsive: true }}
        />
      </div>
    </div>
  );
};

export default ChartPage;