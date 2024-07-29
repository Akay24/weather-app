import React, { useState, useEffect } from 'react';
import './WeatherCard.css';

const WeatherCard = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!city) {
        setWeatherData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch weather data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city, apiKey]);

  if (loading) {
    return <div className="weather-card loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="weather-card error">
        Error: {error}. Please check the city name and try again.
      </div>
    );
  }

  if (!weatherData) {
    return <div className="weather-card">No data available</div>;
  }

  const weatherIconUrl = weatherData.weather[0].icon
    ? `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
    : 'http://openweathermap.org/img/wn/01d@2x.png'; // Default icon

  return (
    <div className="weather-card">
      <h2>{weatherData.name}</h2>
      <img src={weatherIconUrl} alt={weatherData.weather[0].description} />
      <p className="description">{weatherData.weather[0].description}</p>
      <p className="temperature">Temperature: {weatherData.main.temp} °C</p>
      <p className="humidity">Humidity: {weatherData.main.humidity} %</p>
      <p className="wind-speed">Wind Speed: {weatherData.wind.speed} m/s</p>
    </div>
  );
};

export default WeatherCard;
