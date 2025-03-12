from flask import Flask, jsonify, request
from flask_cors import CORS
from database import init_db, get_data, update_data

app = Flask(__name__)
CORS(app)

# Initialiser la base de données
init_db()

@app.route('/get_data', methods=['GET'])
def get_data_route():
    data = get_data()
    return jsonify({
        "labels": list(data.keys()),
        "values": list(data.values())
    })

@app.route('/update_data', methods=['POST'])
def update_data_route():
    data = request.get_json()
    action = data.get('action')

    if action:
        update_data(action)
    
    # Récupère les données mises à jour après modification
    updated_data = get_data()

    return jsonify({
        "labels": list(updated_data.keys()),
        "values": list(updated_data.values())
    })

if __name__ == '__main__':
    app.run(debug=True)
