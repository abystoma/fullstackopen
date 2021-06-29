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
const Total = ({total}) => {
  return (
    <div>all {total}</div>
  )
}

const Average = ({good, bad, total}) => {
  let average = (good - bad) / total
  if (isNaN(average)) {
    average = 0
  }
  return (
    <div>average {average}</div>
  )
}

const Positive = ({good, total}) => {
  let positive = (good / total) * 100
  if (isNaN(positive)) {
    positive = 0
  }
  return (
    <div>positive {positive} %</div>
  )
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
  const total = good + neutral + bad

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
      <Total total={total} />
      <Average good={good} bad={bad} total={total} />
      <Positive good={good} total={total} />
    </div>
  )
}

export default App