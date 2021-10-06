import React from 'react'

const Button = ({ text, handleClick }) => {
  return <button onClick={handleClick}> {text}</button>;
};

const Person = ({  person, handleDelete }) => {
  return (
    <li>{person.name} {person.number}
    <Button text="delete" handleClick={() => handleDelete(person)} />
    </li>
  )
}

export default Person