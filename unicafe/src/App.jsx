import { useState } from 'react'

const Button = (props)=>{
  return(
    <button onClick = {props.onClick}>{props.text}</button>
  )
}

const StatisticsLine = (props)=>{
  return(
    <>
    <tr>
    <td>{props.text}</td> <td>{props.value}</td>
    </tr>
      
    </>
  )
}

const Statistics = (props)=>{
  var good = props.good
  var bad = props.bad
  var neutral = props.neutral

  if(good === 0 && bad === 0 && neutral === 0){
    return(
      <>
      <h1>statistics</h1>
      <div>No feedback given</div>
      </>
    )
  }
  else{
  return (
    <>
    <h1>statistics</h1>
    <table >

    <StatisticsLine text = "good" value = {good}></StatisticsLine>
    <StatisticsLine text = "neutral" value = {neutral}></StatisticsLine>
    <StatisticsLine text = "bad" value = {bad}></StatisticsLine>
    <StatisticsLine text = "all" value = {good +bad + neutral}></StatisticsLine>
    <StatisticsLine text = "average" value = {(good*1 +bad*-1 + neutral*0)/(good+neutral+bad)}></StatisticsLine>
    <StatisticsLine text = "positive" value = {good/(good+neutral+bad)*100 + " %"}></StatisticsLine>
    </table>

  </>
  )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={()=>{setGood(good+1)}} text = "good"></Button>
      <Button onClick={()=>{setNeutral(neutral+1)}} text = "neutral"></Button>
      <Button onClick={()=>{setBad(bad+1)}} text = "bad"></Button>


      <Statistics good = {good} bad = {bad} neutral = {neutral}></Statistics>
    </div>
  )
}

export default App