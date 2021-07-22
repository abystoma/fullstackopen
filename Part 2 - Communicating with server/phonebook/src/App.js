import React, { useState, useEffect } from 'react'
import Person from './components/Persons'
import axios from 'axios'
import noteService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterPersons, setFilterPersons ] = useState(false)
  const [ filteredPersons, setFilteredPersons ] = useState([])

  useEffect(() => {
    noteService.getAll().then(initialPersons  => setPersons(initialPersons ))
  }, [])
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
    const newPerson = {name: newName, number: newNumber}
    noteService.create(newPerson).then(res => {
      oldPersons.push(res);
      setPersons(oldPersons)
      setNewName('')
      setNewNumber('')
    })
  };

 

  const handleFilter = (event) => {
    if(event.target.value !== '') {
      setFilterPersons(true)
      setFilteredPersons(persons.filter(person => person.name.toLowerCase() === event.target.value.toLowerCase()))
    } else {
      setFilterPersons(false)
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input onChange={handleFilter}/>
      </div>
      <h2>Add new</h2>
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
      {filterPersons === false
        ? persons.map(person => (<Person key={person.name} person={person}/>))
        : filteredPersons.map(person => (<Person key={person.name} person = {person}/>))}
      </div>
    )

};
export default App;

