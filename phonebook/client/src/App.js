import React, { useState, useEffect } from 'react'
import Person from './components/Persons'
import personService from './services/personService'
import Notification from './components/Notification'



const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterPersons, setFilterPersons ] = useState(false)
  const [ filteredPersons, setFilteredPersons ] = useState([])
  const [ notification, setNotification ] = useState({})

  useEffect(() => {
    personService.getAll().then(initialPersons  => setPersons(initialPersons ))
  }, [])

  const handleAddName = (event) => {
    let oldPersons = [...persons];
    const personsNames = persons.map((person) => person.name)
    const newPerson = {name: newName, number: newNumber}

    event.preventDefault();
    if (!newName || !newNumber) {
      alert("Name or Number can not be empty");
      return;
    }
    if (personsNames.includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const id = persons.filter((person) => person.name === newName)[0].id
        personService
        .update(id, newPerson)
        .then((newPerson) => {
          const newPersons = persons
            .filter((person) => person.name !== newPerson.name)
            .concat(newPerson)
          setPersons(newPersons)
          setNotification({
            message:`added ${newPerson.name}`,
            type:"success"
          })
          setTimeout(() => {
            setNotification(null) 
          }, 5000)
        })
        .catch(() => {
          handleDeleteError(newName)
        })
      }
      return;
    }
    personService.create(newPerson).then(res => {
      oldPersons.push(res);
      setPersons(oldPersons)
      setNewName('')
      setNewNumber('')
      setNotification({
        message:`updated ${newPerson.name}`,
        type:"success"
      })
      setTimeout(() => {
        setNotification(null) 
      }, 5000)
    })
    .catch(error => {
      setNotification({
        message: error.response.data.error,
        type:'error'
      })
      setTimeout(() => {
        setNotification(null) 
      }, 5000)
    })
 
    
  };

  const handleDeleteError = (name) => {
    console.log("error in deleting name")
    setNotification({
      message:`${name}'s information was already deleted from server`,
      type:"error"
    })
    setTimeout(() => {setNotification(null)}, 5000)
    personService
      .getAll()
      .then(initialNotes => {
        setPersons(initialNotes)
        })
  }


  const handleFilter = (event) => {
    if(event.target.value !== '') {
      setFilterPersons(true)
      setFilteredPersons(persons.filter(person => person.name.toLowerCase() === event.target.value.toLowerCase()))
    } else {
      setFilterPersons(false)
    }
  }
  const handleDelete = ({ id, name }) => {
    if (window.confirm(`Are you sure, you want to delete ${name}?`)) {
      personService.delete(id).then(() => {
        const updatedPerson = persons.filter((person) => person.id !== id);
        setPersons(updatedPerson);
      });
    }
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}></Notification>
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
        ? persons.map(person => (<Person key={person.name} person={person} handleDelete={handleDelete}/>))
        : filteredPersons.map(person => (<Person key={person.name} person = {person} handleDelete={handleDelete}/>))}
      </div>
    )

};
export default App;

