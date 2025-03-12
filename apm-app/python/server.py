from flask import Flask, jsonify, request
from flask_cors import CORS  # Importation de CORS

app = Flask(__name__)

# Autoriser CORS pour toutes les routes
CORS(app)

# Initialisation des données (comptage des événements)
actions_count = {
    "Click": 0,
    "Space": 0,
    "Z": 0,
    "Q": 0,
    "S": 0,
    "D": 0
}

@app.route('/get_data', methods=['GET'])
def get_data():
    # Retourne les données actuelles sous forme de JSON
    return jsonify({
        "labels": list(actions_count.keys()),
        "values": list(actions_count.values())
    })

@app.route('/update_data', methods=['POST'])
def update_data():
    # Récupère l'action envoyée depuis le client
    data = request.get_json()
    action = data.get('action')

    # Si l'action existe dans les données, incrémente son compteur
    if action in actions_count:
        actions_count[action] += 1

    # Retourne les nouvelles données au client
    return jsonify({
        "labels": list(actions_count.keys()),
        "values": list(actions_count.values())
    })

if __name__ == '__main__':
    app.run(debug=True)
