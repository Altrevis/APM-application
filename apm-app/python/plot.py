# python/plot.py

import time
import matplotlib.pyplot as plt
from apm import mouse_clicks, key_presses, start_time

def generate_graph():
    elapsed_time = time.time() - start_time
    apm = mouse_clicks / (elapsed_time / 60)  # Actions par minute pour les clics

    # Préparation des données pour le graphique
    actions = list(key_presses.values())  # Nombre de pressions sur les touches ZQSD et espace
    actions.append(mouse_clicks)  # Ajout des clics de souris
    labels = ['space', 'z', 'q', 's', 'd', 'mouse clicks']

    # Graphique
    plt.clf()  # Clear the previous plot
    plt.bar(labels, actions)
    plt.title(f'Actions par Minute (APM) - {int(apm)} APM')
    plt.xlabel('Actions')
    plt.ylabel('Nombre')
    plt.draw()

# Affichage continu du graphique
plt.ion()  # Mode interactif
while True:
    generate_graph()
    plt.pause(1)  # Mettre à jour le graphique toutes les secondes
