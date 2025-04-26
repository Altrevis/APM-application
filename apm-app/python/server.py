import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import DB_FILE, TRAINING_DB_FILE, init_db, get_data, update_data, get_apm_stats
from database import insert_training_data, get_training_data, init_training_db

app = Flask(__name__)
CORS(app)

# Initialisation des bases de données
init_db()
init_training_db()

@app.route('/get_data', methods=['GET'])
def get_data_route():
    """Récupère les données actuelles des actions."""
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
    """Récupère les statistiques APM pour l'entraînement."""
    stats = get_apm_stats()
    return jsonify({
        "mean_apm": stats["mean_apm"],
        "median_apm": stats["median_apm"]
    })

@app.route('/get_training_results', methods=['GET'])
def get_training_results():
    """Récupère les résultats complets de l'entraînement avec la date du dernier test."""
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

@app.route('/start_training_session', methods=['POST'])
def start_training_session_route():
    """Crée une nouvelle session d'entraînement."""
    connection = sqlite3.connect(TRAINING_DB_FILE)
    cursor = connection.cursor()
    cursor.execute('INSERT INTO training_sessions (session_start) VALUES (datetime("now"))')
    session_id = cursor.lastrowid
    connection.commit()
    connection.close()
    return jsonify({"session_id": session_id})

@app.route('/save_training_results_with_session', methods=['POST'])
def save_training_results_with_session():
    """Enregistre les résultats d'une session d'entraînement."""
    data = request.get_json()
    session_id = data.get('session_id')
    if not session_id:
        return jsonify({"error": "L'ID de session est requis"}), 400

    for action, count in data['results'].items():
        connection = sqlite3.connect(TRAINING_DB_FILE)
        cursor = connection.cursor()
        cursor.execute('''
            INSERT INTO training_results (session_id, action, count) VALUES (?, ?, ?)
        ''', (session_id, action, count))
        connection.commit()
        connection.close()

    return jsonify({"message": "Résultats de l'entraînement enregistrés avec succès!"})

@app.route('/get_training_sessions', methods=['GET'])
def get_training_sessions_route():
    """Récupère toutes les sessions d'entraînement avec des données agrégées."""
    connection = sqlite3.connect(TRAINING_DB_FILE)
    cursor = connection.cursor()
    cursor.execute('''
        SELECT 
            ts.session_start,
            tr.action,
            SUM(tr.count) AS total_count
        FROM 
            training_sessions ts
        JOIN 
            training_results tr ON ts.id = tr.session_id
        GROUP BY 
            ts.session_start, tr.action
    ''')
    sessions = cursor.fetchall()
    connection.close()
    return jsonify(sessions)

@app.route('/get_training_data', methods=['GET'])
def get_training_data_route():
    """Récupère les données agrégées de toutes les sessions d'entraînement."""
    data = get_training_data()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
