import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [cities, setCities] = useState([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

    // Fetch city data from local JSON file
    useEffect(() => {
        const loadCities = async () => {
            try {
                const response = await fetch('/cities.json');
                const data = await response.json();
                setCities(data);
            } catch (error) {
                console.error('Error fetching city data:', error);
            }
        };

        loadCities();
    }, []);

    // Filter cities based on the query
    useEffect(() => {
        if (query.length > 2) {
            const filteredSuggestions = cities.filter(city =>
                city.name.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [query, cities]);

    // Handle input change
    const handleInputChange = (event) => {
        setQuery(event.target.value);
        setActiveSuggestionIndex(-1); // Reset active suggestion index
    };

    // Handle search action
    const handleSearch = () => {
        if (query.trim() !== '') {
            onSearch(query);
            setSuggestions([]); // Clear suggestions when search is performed
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.name);
        setSuggestions([]); // Clear suggestions immediately
        onSearch(suggestion.name);
    };

    // Handle keyboard navigation and search
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (activeSuggestionIndex >= 0) {
                handleSuggestionClick(suggestions[activeSuggestionIndex]);
            } else {
                handleSearch();
            }
        } else if (event.key === 'ArrowDown') {
            setActiveSuggestionIndex(prevIndex => 
                Math.min(prevIndex + 1, suggestions.length - 1)
            );
        } else if (event.key === 'ArrowUp') {
            setActiveSuggestionIndex(prevIndex => 
                Math.max(prevIndex - 1, 0)
            );
        } else if (event.key === 'Escape') {
            setSuggestions([]);
        }
    };

    // Highlight suggestion on mouse hover
    const handleMouseEnter = (index) => {
        setActiveSuggestionIndex(index);
    };

    // Clear active suggestion index on mouse leave
    const handleMouseLeave = () => {
        setActiveSuggestionIndex(-1);
    };

    // Prevent click event from propagating
    const handleClickOutside = (event) => {
        if (event.target.closest('.search-bar') === null) {
            setSuggestions([]);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="search-bar">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter city name"
            />
            <button onClick={handleSearch}>Search</button>

            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.name + suggestion.lat} // Unique key
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            className={index === activeSuggestionIndex ? 'active' : ''}
                        >
                            {suggestion.name}, {suggestion.country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
