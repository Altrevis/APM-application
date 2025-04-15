import sqlite3
from datetime import datetime

DB_FILE = 'data.db'
TRAINING_DB_FILE = 'entrainement.db'

def init_db():
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()
    
    # Créer la table principale si elle n'existe pas encore
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT UNIQUE,
            count INTEGER DEFAULT 0
        )
    ''')

    # Créer une table pour stocker les timestamps des actions
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS action_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Initialiser les valeurs si elles n'existent pas encore
    actions = ["Click", "Space", "Z", "Q", "S", "D"]
    for action in actions:
        cursor.execute('''
            INSERT OR IGNORE INTO actions (action, count) VALUES (?, 0)
        ''', (action,))
    
    connection.commit()
    connection.close()

def init_training_db():
    connection = sqlite3.connect(TRAINING_DB_FILE)
    cursor = connection.cursor()

    # Créer la table pour stocker les résultats d'entraînement
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS training_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT,
            count INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    connection.commit()
    connection.close()

def get_data():
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()
    
    cursor.execute('SELECT action, count FROM actions')
    data = cursor.fetchall()
    
    connection.close()
    
    return {action: count for action, count in data}

def update_data(action):
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    # Incrémente le compteur d'actions
    cursor.execute('''
        UPDATE actions
        SET count = count + 1
        WHERE action = ?
    ''', (action,))
    
    # Insère le timestamp de l'action
    cursor.execute('''
        INSERT INTO action_logs (action) VALUES (?)
    ''', (action,))
    
    connection.commit()
    connection.close()

def insert_training_data(action, count):
    connection = sqlite3.connect(TRAINING_DB_FILE)
    cursor = connection.cursor()

    cursor.execute('''
        INSERT INTO training_results (action, count) VALUES (?, ?)
    ''', (action, count))

    connection.commit()
    connection.close()

def get_training_data():
    connection = sqlite3.connect(TRAINING_DB_FILE)
    cursor = connection.cursor()

    cursor.execute('''
        SELECT action, SUM(count) FROM training_results GROUP BY action
    ''')
    data = cursor.fetchall()

    connection.close()
    return {action: count for action, count in data}

def get_apm_stats():
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    # Récupérer toutes les actions dans les 60 dernières secondes
    cursor.execute('''
        SELECT COUNT(*) 
        FROM action_logs 
        WHERE timestamp >= datetime('now', '-1 minute')
    ''')
    actions_last_minute = cursor.fetchone()[0]

    # Récupérer tous les timestamps pour calculer la médiane
    cursor.execute('''
        SELECT timestamp 
        FROM action_logs 
        ORDER BY timestamp DESC
        LIMIT 60
    ''')
    timestamps = [row[0] for row in cursor.fetchall()]

    connection.close()

    if len(timestamps) > 0:
        # Moyenne APM
        mean_apm = actions_last_minute
        # Médiane APM
        median_apm = timestamps[len(timestamps) // 2]
    else:
        mean_apm = 0
        median_apm = None

    return {
        "mean_apm": mean_apm,
        "median_apm": median_apm
    }

# Initialiser les deux bases de données
if __name__ == "__main__":
    init_db()
    init_training_db()
