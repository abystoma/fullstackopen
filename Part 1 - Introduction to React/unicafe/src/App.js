import React, { useState } from 'react'

const Button = ({text, handleClick}) => {
  return (
    <div>
      <button onClick={handleClick}>{text}</button>
    </div>
  );
};

const Display = ({text, number}) => {
  return(
      <div>{text} {number}</div>
  );
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button text = "good" handleClick={handleGoodClick}/>
      <Button text = "neutral" handleClick={handleNeutralClick} />
      <Button text = "bad" handleClick={handleBadClick}/>
      <h1>statistics</h1>
      <Display text="good" number={good} />
      <Display text="neutral" number={neutral} />
      <Display text="bad" number={bad} />
    </div>
  )
}

export default App