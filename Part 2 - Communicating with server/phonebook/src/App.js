import React, { useState } from "react";
import Person from './components/Persons'

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '39-44-5323523' }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

  const handleAddName = (event) => {
    let oldPersons = [...persons];
    event.preventDefault();
    if (!newName || !newNumber) {
      alert("Name or Number can not be empty");
      return;
    }
    if (oldPersons.map((person) => person.name.toLowerCase()).includes(newName.toLowerCase().trim())) {

      window.alert(`${newName.trim()} is already added to phonebook`);
      return;
    } 
  
    oldPersons.push({ name: newName, number: newNumber });
    setPersons(oldPersons);
    setNewName("");
    setNewNumber("");
    
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleAddName}>
        <div>
          name:
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div>
        
        <div> 
        number: 
        <input
            value={newNumber}
            onChange={(event) => setNewNumber(event.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      { /*<div>debug: {newName}</div> */}
      <h2>Numbers</h2>
      {persons.map((person) => (
        <Person key={person.name} 
        person={person}/>
      ))
      }
    </div>
  );
};
export default App;