import React, { useState, useEffect } from "react"


// This next variables are used for debugging the timer
const TIMER_INCREMENT = 1
const TIMER_INTERVAL_MS = 25 // TODO: Reset to 1000 ms

// TODO: Break down the App component into the major subcomponents: Input and Display
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
        setSeconds(prevTime => prevTime + TIMER_INCREMENT)
      }, TIMER_INTERVAL_MS);
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
    //alert(`The new task "${newTask}" with a time of "${seconds}s" has been logged`)
    createNewTask(newTask, seconds)
    // Reset the form
    setNewTask("")
    resetTimer()
  }
  // For the time being the LocalStorage will be used a data base
  const [tasksList, setTasksList] = useState([])
  // Function that acts as the Create data whenever the new task input is submitted
  const createNewTask = (name, duration) => {
    console.log("Inside createTask", tasksList)
    let newTaskObject = {
      id: Date.now(),
      name: name,
      duration: duration
    }
    setTasksList([...tasksList, newTaskObject])
  }
  useEffect(() => {
    console.log("new Taskslist", tasksList)
    console.log("Updating the LocalStorage")
    localStorage.setItem('tasksList', JSON.stringify(tasksList));
  }, [tasksList])

  const deleteTask = id => setTasksList(tasksList.filter(el => el.id !== id))

  return (
    <div>
      <h2>Time Tracker application</h2>
      {/* Timer Display */}
      <p>Seconds elapsed: {seconds}</p>
      {/* Timer Controls */}
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
      {/* New Task Input */}
      <form onSubmit={handleSubmitNewTask}>
        <input id="newTaskInput" name="newTaskInput" type="text" value={newTask} onChange={handleChangeNewTask} placeholder="Input your task"/>
        <input id="submitNewTask" name="submitNewTask" type="submit" value="Submit" />
      </form>
      {/* List of tasks */}
      <ul>
        {tasksList.map((task, i) =>
          <>
            <li key={i}>{task.duration} | {task.name}</li>
            <button onClick={() => deleteTask(task.id)}>X</button>
          </>
        )}
      </ul>
    </div>
  )
}