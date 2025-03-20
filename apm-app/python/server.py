from flask import Flask, jsonify, request
from flask_cors import CORS
from database import init_db, get_data, update_data, get_apm_stats

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
