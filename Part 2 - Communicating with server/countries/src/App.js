import React, {useState, useEffect} from "react";
import axios from "axios"
import Countries from './components/Countries';
import Search from './components/Search';

const App = () => { 
  const[countries, setCountries] = useState([]);
  const[search, setSearch] = useState('Enter country');

  const countriesHook = () => {
    axios
      .get("https://restcountries.eu/rest/v2/name/" + search)
      .then((response) => setCountries(response.data))
      .catch((err) => console.log(err));
  };

  useEffect(countriesHook, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCountries(setSearch);
    setSearch(e.target.value);
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };



  return (
    <div>
      <Search 
      handleSearch={handleSearch}
      search={search} handleSearchChange={handleSearchChange}
      />
      <Countries countries={countries} search={search}  setSearch={setSearch} />
    </div>
  );
};

export default App;