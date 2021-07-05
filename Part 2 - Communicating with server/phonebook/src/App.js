import React, { useState } from "react";
import Person from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  const handleAddName = (event) => {
    event.preventDefault();
    if (
      persons
        .map(element => element.name.toLowerCase())
        .includes(newName.toLowerCase())
    ) {
      window.alert(`${newName} is already added to phonebook`);
    } else {
      let oldPersons = [...persons];
      oldPersons.push({ name: newName });
      setPersons(oldPersons);
      setNewName("");
    }
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
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <Person key={person.id} person={person}/>
      ))
      }
    </div>
  );
};
export default App;