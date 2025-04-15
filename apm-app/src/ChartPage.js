import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const ChartPage = () => {
  const [chartData, setChartData] = useState({ x: [], y: [] });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:5000/get_training_data');
      const data = response.data;
      setChartData({
        x: Object.keys(data),
        y: Object.values(data),
      });
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Graphique Complet</h1>
      <Plot
        data={[
          {
            type: 'bar',
            x: chartData.x,
            y: chartData.y,
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
