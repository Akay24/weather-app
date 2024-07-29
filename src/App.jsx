import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';

const App = () => {
    const [city, setCity] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    const handleSearch = (selectedCity) => {
        setCity(selectedCity);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
            <h1>Weather App</h1>
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <SearchBar onSearch={handleSearch} />
            {city && <WeatherCard city={city} />}
        </div>
    );
};

export default App;
