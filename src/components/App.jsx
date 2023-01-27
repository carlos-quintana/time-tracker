import React, { useState, useEffect } from "react"
import exampleTasks from "../exampleTasks.json"
import PanelData from "./PanelData"
import PanelInputs from "./PanelInputs"


// This next variables are used for debugging the timer
const TIMER_INCREMENT = 1
const TIMER_INTERVAL_MS = 25 // TODO: Reset to 1000 ms

// TODO: Break down the App component into the major subcomponents: Input and Display
export default function App() {
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

  // Load a set of example tasks from a json file
  useEffect(() => setTasksList(exampleTasks), [])

  return (
    <div>
      <h2>Time Tracker application</h2>
      <PanelInputs createNewTask={createNewTask} />
      <PanelData tasksList={tasksList} deleteTask={deleteTask} />
    </div>
  )
}