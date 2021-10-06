import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ city }) => {
  const [weather, setWeather] = useState();
  const apiKey = process.env.REACT_APP_API_KEY;
  const queryUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

  useEffect(() => axios.get(queryUrl).then((res) => setWeather(res.data), []));

  if (!weather) return <div>Loading weather...</div>;

  return (
    <div>
      <h2>Weather in {city}</h2>
      <div>
        <strong>temperature:</strong> {weather.current.temperature} Celsius
      </div>
      {weather.current.weather_icons.map((icon, index) => (
        <img
          alt={weather.current.weather_descriptions[index]}
          key={weather.current.weather_descriptions[index]}
          src={icon}
        />
      ))}
      <div>
        <strong>wind:</strong> {weather.current.wind_speed} mph direction{' '}
        {weather.current.wind_dir}
      </div>
    </div>
  );
};

export default Weather;