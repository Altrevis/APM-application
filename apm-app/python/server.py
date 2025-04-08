import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import DB_FILE, init_db, get_data, update_data, get_apm_stats

app = Flask(__name__)
CORS(app)

init_db()

@app.route('/get_data', methods=['GET'])
def get_data_route():
    data = get_data()
    stats = get_apm_stats()
    return jsonify({
        "labels": list(data.keys()),
        "values": list(data.values()),
        "mean_apm": stats["mean_apm"],
        "median_apm": stats["median_apm"]
    })

@app.route('/get_training_score', methods=['GET'])
def get_training_score():
    stats = get_apm_stats()
    return jsonify({
        "mean_apm": stats["mean_apm"],
        "median_apm": stats["median_apm"]
    })

@app.route('/get_training_results', methods=['GET'])
def get_training_results():
    data = get_data()
    stats = get_apm_stats()

    # Récupérer les dates des tests pour afficher la date du graphique
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    cursor.execute('''
        SELECT timestamp 
        FROM action_logs 
        ORDER BY timestamp DESC
        LIMIT 1
    ''')
    last_test_timestamp = cursor.fetchone()[0]

    connection.close()

    return jsonify({
        "labels": list(data.keys()),
        "values": list(data.values()),
        "mean_apm": stats["mean_apm"],
        "median_apm": stats["median_apm"],
        "last_test_date": last_test_timestamp
    })


@app.route('/update_data', methods=['POST'])
def update_data_route():
    data = request.get_json()
    action = data.get('action')

    if action:
        update_data(action)
    
    updated_data = get_data()
    stats = get_apm_stats()

    return jsonify({
        "labels": list(updated_data.keys()),
        "values": list(updated_data.values()),
        "mean_apm": stats["mean_apm"],
        "median_apm": stats["median_apm"]
    })

if __name__ == '__main__':
    app.run(debug=True)
