import requests
import random
import time
from datetime import datetime

def generate_sensor_data():
    """Generate random sensor data within realistic ranges."""
    return {
        'temperature': round(random.uniform(20.0, 30.0), 2),
        'humidity': round(random.uniform(30.0, 70.0), 2)
    }

def send_sensor_data(data):
    """Send sensor data to the API endpoint."""
    try:
        response = requests.post('http://localhost:5000/api/data', json=data)
        if response.status_code == 201:
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Data sent successfully: {data}")
        else:
            print(f"Error sending data: {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")

def main():
    print("Starting sensor data simulation...")
    print("Press Ctrl+C to stop")
    
    while True:
        data = generate_sensor_data()
        send_sensor_data(data)
        time.sleep(3)  # Wait for 3 seconds before sending next reading

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\nSimulation stopped by user") 