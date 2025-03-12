import io
import matplotlib.pyplot as plt
from flask import Flask, send_file
import threading
from pynput.mouse import Listener as MouseListener
from pynput.keyboard import Listener as KeyboardListener

app = Flask(__name__)

# Variables pour stocker les compteurs
key_count = {"Space": 0, "Z": 0, "Q": 0, "S": 0, "D": 0, "Click": 0}

# Fonction pour écouter les clics de souris
def on_click(x, y, button, pressed):
    if pressed:
        key_count["Click"] += 1

# Fonction pour écouter les actions du clavier
def on_press(key):
    try:
        if key.char == ' ':
            key_count["Space"] += 1
        elif key.char == 'z':
            key_count["Z"] += 1
        elif key.char == 'q':
            key_count["Q"] += 1
        elif key.char == 's':
            key_count["S"] += 1
        elif key.char == 'd':
            key_count["D"] += 1
    except AttributeError:
        pass

# Endpoint pour récupérer le graphique
@app.route('/graph')
def graph():
    # Générer un graphique à partir des données
    fig, ax = plt.subplots()
    labels = ["Click", "Space", "Z", "Q", "S", "D"]
    values = [key_count["Click"], key_count["Space"], key_count["Z"], key_count["Q"], key_count["S"], key_count["D"]]
    
    ax.bar(labels, values)
    ax.set_title('Actions Clavier et Souris')
    ax.set_xlabel('Actions')
    ax.set_ylabel('Nombre')

    # Sauvegarder le graphique dans un buffer en mémoire
    img_io = io.BytesIO()
    fig.savefig(img_io, format='png')
    img_io.seek(0)

    # Renvoyer l'image au client
    return send_file(img_io, mimetype='image/png')

# Démarrer les écouteurs de souris et de clavier dans des threads séparés
def start_listeners():
    with MouseListener(on_click=on_click) as listener:
        listener.start()

    with KeyboardListener(on_press=on_press) as listener:
        listener.start()

if __name__ == '__main__':
    # Lancer le serveur Flask et les écouteurs de souris et clavier
    threading.Thread(target=start_listeners).start()
    app.run(debug=True)