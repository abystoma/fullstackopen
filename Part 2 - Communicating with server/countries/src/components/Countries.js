import React from 'react';
import CountryInfo from './CountryInfo';

const Countries = ({ countries, search }) => {

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );


  if (filteredCountries.length === 1)
    return <CountryInfo country={filteredCountries[0]} />;

  else if (filteredCountries.length > 10)
    return <div> Too many results, please narrow down your search ({countries.length}{" "} results)</div>;

  return (
    <div>
      {filteredCountries.map((country) => (
        <div key={country.name}>{country.name}</div>
      ))}
    </div>
  );
};

export default Countries;