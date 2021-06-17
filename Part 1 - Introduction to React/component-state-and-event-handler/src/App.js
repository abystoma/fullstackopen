import React, { useState } from 'react'

const Display = ({ counter }) => <div>{counter}</div>

// const Display = ({ counter }) => {
//   return (
//     <div>{counter}</div>
//   )
// }


const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1) //Event Handler
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)
  return (
    <div>
      <Display counter={counter}/>
      <Button
        handleClick={increaseByOne}
        text='plus'
      />
      <Button
        handleClick={setToZero}
        text='zero'
      />     
      <Button
        handleClick={decreaseByOne}
        text='minus'
      /> 
    </div>
  )
// The event handler is passed to the Button component through the handleClick prop. 
// The name of the prop itself is not that significant, but our naming choice wasn't completely random.
// React's own official tutorial suggests this convention.


}

export default App

