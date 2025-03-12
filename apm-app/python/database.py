import sqlite3

DB_FILE = 'data.db'

def init_db():
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()
    
    # Créer la table si elle n'existe pas encore
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT UNIQUE,
            count INTEGER DEFAULT 0
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
    
    cursor.execute('''
        UPDATE actions
        SET count = count + 1
        WHERE action = ?
    ''', (action,))
    
    connection.commit()
    connection.close()

# Initialiser la base de données lors du lancement
if __name__ == "__main__":
    init_db()
