# IoT Dashboard

A modern, responsive IoT dashboard built with Flask and Chart.js for real-time sensor data visualization. Features a dark/light theme, customizable charts, and real-time updates.

![Dashboard Preview](https://github.com/sanjaychethu/IoT-Dashboard/blob/66006f984b27cce58437206a75b65c6c57847c68/Screenshot%20(1003).png)

![](https://github.com/sanjaychethu/IoT-Dashboard/blob/66006f984b27cce58437206a75b65c6c57847c68/Screenshot%20(1004).png)
![](https://github.com/sanjaychethu/IoT-Dashboard/blob/66006f984b27cce58437206a75b65c6c57847c68/Screenshot%20(1005).png)
![](https://github.com/sanjaychethu/IoT-Dashboard/blob/66006f984b27cce58437206a75b65c6c57847c68/Screenshot%20(1002).png)

## Features


- 📊 Real-time data visualization using Chart.js
- 📱 Fully responsive design
- 🔄 Customizable update intervals
- 📈 Multiple chart types (Line, Bar, Scatter)
- 💾 SQLite database for data storage
- 🔌 REST API for sensor data
- 🤖 Sensor data simulation utility
- 🌓 Dark/Light theme with system preference detection

## Tech Stack

- Backend: Python Flask
- Frontend: HTML5, CSS3, JavaScript
- Database: SQLite
- Charts: Chart.js

## Quick Start

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd iot-dashboard
   ```

2. Create and activate virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the application:
   ```bash
   python run.py
   ```

5. (Optional) Run the sensor simulator in a separate terminal:
   ```bash
   python utils/sensor_simulator.py
   ```

The dashboard will be available at `http://localhost:5000`

## Deployment Options

### Deploy to Heroku

1. Install Heroku CLI and login:
   ```bash
   # Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
   heroku login
   ```

2. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

3. Add Procfile (already included):
   ```
   web: gunicorn run:app
   ```

4. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Python Anywhere

1. Sign up for a Python Anywhere account
2. Upload your code or clone from GitHub
3. Create a virtual environment and install requirements
4. Configure WSGI file to point to your `run.py`
5. Set up your web app using the Python Anywhere dashboard

### Deploy using Docker

1. Build the Docker image:
   ```bash
   docker build -t iot-dashboard .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 iot-dashboard
   ```

## API Documentation

### Get Sensor Data
- **GET** `/api/data`
- Returns the latest 20 sensor readings
- Response format:
  ```json
  [
    {
      "id": 1,
      "temperature": 25.5,
      "humidity": 60.0,
      "timestamp": "2024-02-20T10:30:00Z"
    }
  ]
  ```

### Add Sensor Reading
- **POST** `/api/data`
- Request body:
  ```json
  {
    "temperature": 25.5,
    "humidity": 60.0
  }
  ```
- Returns the created reading with timestamp

## Customization

### Theme
- The dashboard defaults to dark mode
- Toggle theme using the sun/moon icon
- Theme preference is saved in localStorage

### Chart Settings
- Update Interval: 1s, 3s, 5s, 10s
- Chart Types: Line, Bar, Scatter
- Data Points: 10, 20, 30, 50

### Styling
- Edit `static/css/style.css` for custom styles
- CSS variables in `:root` for theme colors
- Responsive breakpoints at 1024px, 768px, and 480px

## Development

### Project Structure
```
iot-dashboard/
├── app/
│   ├── __init__.py          # Flask app initialization
│   ├── routes.py            # API routes
│   ├── models.py            # Database models
│   ├── templates/           # HTML templates
│   └── static/              # Static files (CSS, JS)
├── utils/
│   └── sensor_simulator.py  # Data simulator
├── config.py               # Configuration
├── requirements.txt        # Python dependencies
├── Procfile               # Heroku deployment
└── run.py                 # Application entry point
```
