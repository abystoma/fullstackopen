import React from 'react';
import Weather from './Weather';

const CountryInfo = ({ country }) => (
  <div>
    <h1>{country.name}</h1>
    <div>
      <strong>capital:</strong> {country.capital}
    </div>
    <div>
      <strong>population:</strong> {country.population}
    </div>
    <h2>Languages</h2>
    <ul>
      {country.languages.map((language) => (
        <li key={language.iso639_1}>{language.name}</li>
      ))}
    </ul>
    <img alt={`${country.name} flag`} src={country.flag} width="200" />
    <Weather city={country.capital} />
  </div>
);

export default CountryInfo;