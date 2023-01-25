import React, { useState, useEffect } from "react"

export default function App() {
  // Holds the current amount of seconds the timer has counted
  const [seconds, setSeconds] = useState(0)
  // Keeps track of the state of the timer: it's running or it's stopped or it's zero
  const [timerStatus, setTimerStatus] = useState("stopped");

  // Whenever the timer status is changed, it either creates an interval or clears it to keep track of the seconds
  useEffect(() => {
    console.log("Timer status: ", timerStatus)
    let timerSetInterval = null;
    if (timerStatus === "running") {
      timerSetInterval = setInterval(() => {
        setSeconds(prevTime => prevTime + 1)
      }, 1000);
    } else 
      clearInterval(timerSetInterval)
    return () => clearInterval(timerSetInterval);
  }, [timerStatus])

  // These functions are used in the timer control buttons
  const startTimer = () => setTimerStatus("running")
  const stopTimer = () => setTimerStatus("stopped")
  const resetTimer = () => { setTimerStatus("stopped"); setSeconds(0) }
  // These functions belong to the new task form
  const [newTask, setNewTask] = useState("")
  const handleChangeNewTask = event => {
    setNewTask(event.target.value)
  }
  const handleSubmitNewTask = event => {
    event.preventDefault()
    // Submit the new task
    alert(`The new task "${newTask}" with a time of "${seconds}s" has been logged`)
    // Reset the form
    setNewTask("")
    resetTimer()
  }

  return (
    <div>
      <h2>Time Tracker application</h2>

      <p>Seconds elapsed: {seconds}</p>

      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
      <form onSubmit={handleSubmitNewTask}>
        <input id="newTaskInput" name="newTaskInput" type="text" value={newTask} onChange={handleChangeNewTask} placeholder="Input your task"/>
        <input id="submitNewTask" name="submitNewTask" type="submit" value="Submit" />
      </form>

    </div>
  )
}