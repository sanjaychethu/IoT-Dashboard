from flask import Blueprint, jsonify, request, render_template
from app.models import SensorData
from app import db
from config import Config

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/api/data', methods=['GET'])
def get_data():
    # Get the latest sensor readings in chronological order
    readings = SensorData.query.order_by(SensorData.timestamp.desc())\
        .limit(Config.DATA_POINTS_LIMIT).all()
    # Reverse to get chronological order (oldest to newest)
    readings.reverse()
    return jsonify([reading.to_dict() for reading in readings])

@bp.route('/api/data', methods=['POST'])
def add_data():
    if not request.is_json:
        return jsonify({'error': 'Content-Type must be application/json'}), 400
    
    data = request.get_json()
    
    # Validate required fields
    if 'temperature' not in data or 'humidity' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create new sensor reading
    reading = SensorData.from_dict(data)
    db.session.add(reading)
    db.session.commit()
    
    return jsonify(reading.to_dict()), 201 