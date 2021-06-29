import React, { useState } from 'react'

const Statistic = (props) => {
  return (
    <tr>
    <td>{props.text}</td>
    <td>
      {props.value}
    </td>
  </tr>
  )


}

const Button = (props) => {
  return (
    <div>
      <button onClick={props.handleClick}>{props.text}</button>
    </div>
  );
};
const Statistics = (props) => {

  if (props.total === 0) return (
    <div>

    <h1>statistics</h1>
    <p>No feedback given</p>
    </div>

  )

  return (
  <div>
    <h1>statistics</h1>
    <table>

    <Statistic text="good" value={props.good}></Statistic>
    <Statistic text="netural" value={props.neutral}></Statistic>
    <Statistic text="bad" value={props.bad}></Statistic>
    <Statistic text="all"value={<Total total= {props.total}/>}></Statistic>
    <Statistic text="average"value={<Average good = {props.good} bad = {props.bad} total = {props.total}/>}></Statistic>
    <Statistic text="percentage"value={<Positive good = {props.good} total = {props.total}/>}></Statistic>

    
    
    </table>

 </div>
 )
  
}

const Total = (props) => {
  return (
    <div>{props.total}</div>
  )
}

const Average = (props) => {
  let average = (props.good - props.bad) / props.total
  if (isNaN(average)) {
    average = 0
  }
  return (
    <div>{average}</div>
  )
}

const Positive = (props) => {
  let positive = (props.good / props.total) * 100
  if (isNaN(positive)) {
    positive = 0
  }
  return (
    <div>{positive} %</div>
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
      <Statistics good = {good} neutral = {neutral} bad = {bad} total = {total}/>
    </div>
  )
}

export default App