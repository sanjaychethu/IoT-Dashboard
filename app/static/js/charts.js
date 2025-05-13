// Theme handling
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme || 'dark';  // Set dark as default
    document.documentElement.setAttribute('data-theme', theme);
    return theme;
}

let currentTheme = initTheme();

document.getElementById('themeToggle').addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateChartsTheme();
});

// Chart configuration
function getChartConfig(currentTheme) {
    const isDark = currentTheme === 'dark';
    return {
        type: 'line',
        options: {
            responsive: true,
            animation: {
                duration: 0
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'second',
                        displayFormats: {
                            second: 'HH:mm:ss'
                        }
                    },
                    grid: {
                        color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: isDark ? '#e2e8f0' : '#4a5568'
                    },
                    title: {
                        display: true,
                        text: 'Time',
                        color: isDark ? '#e2e8f0' : '#4a5568'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: isDark ? '#e2e8f0' : '#4a5568'
                    }
                }
            }
        }
    };
}

// Initialize charts
let chartConfig = getChartConfig(currentTheme);
let chartType = 'line';
let updateInterval = 3000;
let dataPointsLimit = 20;

const temperatureChart = new Chart(
    document.getElementById('temperatureChart'),
    {
        ...chartConfig,
        data: {
            datasets: [{
                label: 'Temperature',
                borderColor: currentTheme === 'dark' ? '#63b3ed' : '#e53e3e',
                backgroundColor: currentTheme === 'dark' ? '#63b3ed33' : '#fc818133',
                data: [],
                pointRadius: 3,
                borderWidth: 2,
                tension: 0.2
            }]
        },
        options: {
            ...chartConfig.options,
            scales: {
                ...chartConfig.options.scales,
                y: {
                    ...chartConfig.options.scales.y,
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        color: currentTheme === 'dark' ? '#e2e8f0' : '#4a5568'
                    }
                }
            }
        }
    }
);

const humidityChart = new Chart(
    document.getElementById('humidityChart'),
    {
        ...chartConfig,
        data: {
            datasets: [{
                label: 'Humidity',
                borderColor: currentTheme === 'dark' ? '#9f7aea' : '#3182ce',
                backgroundColor: currentTheme === 'dark' ? '#9f7aea33' : '#63b3ed33',
                data: [],
                pointRadius: 3,
                borderWidth: 2,
                tension: 0.2
            }]
        },
        options: {
            ...chartConfig.options,
            scales: {
                ...chartConfig.options.scales,
                y: {
                    ...chartConfig.options.scales.y,
                    title: {
                        display: true,
                        text: 'Humidity (%)',
                        color: currentTheme === 'dark' ? '#e2e8f0' : '#4a5568'
                    },
                    max: 100
                }
            }
        }
    }
);

// Update charts theme
function updateChartsTheme() {
    const newConfig = getChartConfig(currentTheme);
    
    [temperatureChart, humidityChart].forEach(chart => {
        chart.options.scales = newConfig.options.scales;
        if (chart === temperatureChart) {
            chart.data.datasets[0].borderColor = currentTheme === 'dark' ? '#63b3ed' : '#e53e3e';
            chart.data.datasets[0].backgroundColor = currentTheme === 'dark' ? '#63b3ed33' : '#fc818133';
        } else {
            chart.data.datasets[0].borderColor = currentTheme === 'dark' ? '#9f7aea' : '#3182ce';
            chart.data.datasets[0].backgroundColor = currentTheme === 'dark' ? '#9f7aea33' : '#63b3ed33';
        }
        chart.update('none');
    });
}

// Handle chart controls
document.getElementById('chartStyle').addEventListener('change', (e) => {
    chartType = e.target.value;
    [temperatureChart, humidityChart].forEach(chart => {
        chart.config.type = chartType;
        chart.update('none');
    });
});

document.getElementById('updateInterval').addEventListener('change', (e) => {
    updateInterval = parseInt(e.target.value);
    clearInterval(updateIntervalId);
    updateIntervalId = setInterval(updateCharts, updateInterval);
});

document.getElementById('dataPoints').addEventListener('change', (e) => {
    dataPointsLimit = parseInt(e.target.value);
});

// Fullscreen handling
function toggleFullscreen(element) {
    if (!document.fullscreenElement) {
        element.requestFullscreen();
        element.classList.add('fullscreen');
    } else {
        document.exitFullscreen();
        element.classList.remove('fullscreen');
    }
}

document.getElementById('tempFullscreen').addEventListener('click', () => {
    toggleFullscreen(document.querySelector('.chart-wrapper:first-child'));
});

document.getElementById('humidityFullscreen').addEventListener('click', () => {
    toggleFullscreen(document.querySelector('.chart-wrapper:last-child'));
});

// Update function
async function updateCharts() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data && data.length > 0) {
            // Update charts
            const chartData = data.slice(-dataPointsLimit).map(reading => ({
                x: new Date(reading.timestamp),
                y: reading.temperature || reading.humidity
            }));

            temperatureChart.data.datasets[0].data = data.slice(-dataPointsLimit).map(reading => ({
                x: new Date(reading.timestamp),
                y: reading.temperature
            }));
            
            humidityChart.data.datasets[0].data = data.slice(-dataPointsLimit).map(reading => ({
                x: new Date(reading.timestamp),
                y: reading.humidity
            }));
            
            temperatureChart.update('none');
            humidityChart.update('none');
            
            // Update current readings
            const latest = data[data.length - 1];
            document.getElementById('currentTemp').textContent = latest.temperature.toFixed(1);
            document.getElementById('currentHumidity').textContent = latest.humidity.toFixed(1);
        }
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
}

// Initial update
updateCharts();

// Start update interval
let updateIntervalId = setInterval(updateCharts, updateInterval); 