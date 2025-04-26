import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const ChartPage = () => {
  const [sessionsData, setSessionsData] = useState([]);

  // Liste prédéfinie de couleurs
  const predefinedColors = [
    '#ff7f0e', // orange
    '#9467bd', // violet
    '#8c564b', // marron
    '#e377c2', // rose
    '#7f7f7f', // gris
    '#bcbd22', // jaune-vert
    '#17becf'  // cyan
  ];

  // Chargement des données des sessions d'entraînement
  useEffect(() => {
    const fetchTrainingSessions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_training_sessions');
        const rawData = response.data;

        // Transformation des données dans un format pratique
        const sessions = {};
        rawData.forEach(([sessionStart, action, count]) => {
          if (!sessions[sessionStart]) {
            sessions[sessionStart] = {};
          }
          sessions[sessionStart][action] = count;
        });

        // Conversion de l'objet en tableau pour le graphique
        const formattedData = Object.entries(sessions).map(([session, actions]) => ({
          session,
          ...actions,
        }));

        setSessionsData(formattedData);
      } catch (error) {
        console.error("Erreur lors du chargement des données des sessions :", error);
      }
    };

    fetchTrainingSessions();
  }, []);

  return (
    <div>
      <h1>Comparaison des Résultats des Sessions d'Entraînement</h1>

      {/* Affichage du graphique */}
      <Plot
        data={sessionsData.map((session, index) => {
          const values = Object.values(session).filter((value) => typeof value === 'number');

          return {
            type: 'bar',
            name: session.session,
            x: Object.keys(session).filter((key) => key !== 'session'),
            y: values,
            marker: {
              color: predefinedColors[index % predefinedColors.length], // Utilisation des couleurs prédéfinies
            },
          };
        })}
        layout={{
          title: "Comparaison des Résultats des Sessions d'Entraînement",
          barmode: 'group', // Regroupement des barres pour faciliter la comparaison
          xaxis: { title: 'Actions' },
          yaxis: { title: 'Nombre de fois' },
        }}
      />
    </div>
  );
};

export default ChartPage;