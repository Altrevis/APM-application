import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const RealTimeGraph = () => {
  const [data, setData] = useState({
    labels: ["Click", "Space", "Z", "Q", "S", "D"],
    values: [0, 0, 0, 0, 0, 0], // Initial values
  });

  // Fonction pour récupérer les données toutes les 2 secondes
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://localhost:5000/get_data")
        .then((response) => response.json())
        .then((data) => {
          setData(data); // Mettre à jour les données avec les nouvelles valeurs
        })
        .catch((error) => console.error("Erreur de récupération des données :", error));
    }, 2000); // Mise à jour toutes les 2 secondes

    // Ajout des événements pour les actions clavier et souris
    const handleKeyPress = (event) => {
      if (event.key === ' ') {
        // Si la touche espace est appuyée
        updateGraphData("Space");
      } else if (event.key === 'z') {
        // Si la touche Z est appuyée
        updateGraphData("Z");
      } else if (event.key === 'q') {
        // Si la touche Q est appuyée
        updateGraphData("Q");
      } else if (event.key === 's') {
        // Si la touche S est appuyée
        updateGraphData("S");
      } else if (event.key === 'd') {
        // Si la touche D est appuyée
        updateGraphData("D");
      }
    };

    const handleMouseClick = () => {
      // Lorsque la souris est cliquée
      updateGraphData("Click");
    };

    const updateGraphData = (label) => {
      fetch('http://localhost:5000/update_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: label }),
      })
        .then((response) => response.json())
        .then((data) => {
          setData(data); // Mise à jour des données du graphique
        })
        .catch((error) => console.error("Erreur d'envoi des données :", error));
    };

    // Ajout des événements au montage
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleMouseClick);

    // Nettoyage des événements lors du démontage
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleMouseClick);
    };
  }, []);

  return (
    <div>
      <h1>Graphiques des Actions Clavier et Souris</h1>
      <Plot
        data={[
          {
            type: 'bar',
            x: data.labels,
            y: data.values,
            marker: {
              color: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'], // Couleurs pour les colonnes
            },
          },
        ]}
        layout={{
          title: 'Actions Clavier et Souris',
          xaxis: {
            title: 'Actions',
          },
          yaxis: {
            title: 'Nombre d\'actions',
          },
        }}
      />
    </div>
  );
};

export default RealTimeGraph;
