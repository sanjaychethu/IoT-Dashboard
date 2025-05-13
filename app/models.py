from datetime import datetime
from app import db

class SensorData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'temperature': self.temperature,
            'humidity': self.humidity,
            'timestamp': self.timestamp.isoformat()
        }

    @staticmethod
    def from_dict(data):
        return SensorData(
            temperature=data.get('temperature'),
            humidity=data.get('humidity')
        ) 