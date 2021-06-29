import React, { useState } from 'react'

const Button = (props) => {
  return (
    <div>
      <button onClick={props.handleClick}>{props.text}</button>
    </div>
  );
};
const Statistics = (props) => {

  if (props.total === 0) return <p>No feedback given</p>;

  return (
  <div>
    <Total total= {props.total}/>
    <Average good = {props.good} bad = {props.bad} total = {props.total}/>
    <Positive good = {props.good} total = {props.total}/>
 </div>
 )
  
}
const Display = (props) => {
  return(
      <div>{props.text} {props.number}</div>
  );
}
const Total = (props) => {
  return (
    <div>all {props.total}</div>
  )
}

const Average = (props) => {
  let average = (props.good - props.bad) / props.total
  if (isNaN(average)) {
    average = 0
  }
  return (
    <div>average {average}</div>
  )
}

const Positive = (props) => {
  let positive = (props.good / props.total) * 100
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
      <Statistics good = {good} neutral = {neutral} bad = {bad} total = {total}/>

    </div>
  )
}

export default App