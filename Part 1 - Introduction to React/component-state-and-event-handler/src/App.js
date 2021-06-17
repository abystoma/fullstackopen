import React, { useState } from 'react'

const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  
  const setToZero = () => setCounter(0)
  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}> 
        zero
      </button>
    </div>
  )
  //Here, the event handlers have been defined correctly. The value of the onClick attribute is a variable containing a reference to a function:
{/* <button onClick={increaseByOne}> 
  plus
</button> */}
}

export default App

