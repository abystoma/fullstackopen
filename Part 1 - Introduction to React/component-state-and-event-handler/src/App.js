import React, { useState } from 'react'

const App = (props) => {
  const [ counter, setCounter ] = useState(0)
  //The counter variable is assigned the initial value of state which is zero. 
  //The variable setCounter is assigned to a function that will be used to modify the state.
  // const handleClick = () => {
  //   console.log('clicked')
  // }

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(0)}> 
        zero
      </button>
    </div>
  )
}

export default App

// Every time the setCounter modifies the state it causes the component to re-render. 
// The value of the state will be incremented again after one second, and this will continue to 
// repeat for as long as the application is running.