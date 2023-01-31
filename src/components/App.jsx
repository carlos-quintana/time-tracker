import React, { useState, useEffect } from "react"
import exampleTasks from "../exampleTasks.json"
import PanelData from "./PanelData"
import PanelInputs from "./PanelInputs"

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

  const editTask = (idEdit, newTask) => {
    console.log(`Editing the task with id ${idEdit}`)
    console.log(newTask)
    setTasksList(tasksList.map(task => task.id === idEdit ? newTask : task))
  }

  const deleteTask = id => {
    console.log(`Deleting the task with id ${id}`)
    setTasksList(tasksList.filter(el => el.id !== id))
  }

  // Load a set of example tasks from a json file
  useEffect(() => setTasksList(exampleTasks), [])

  return (
    <div>
      <h2>Time Tracker application</h2>
      <PanelInputs
        createNewTask={createNewTask} />
      <PanelData
        tasksList={tasksList}
        editTask={editTask}
        deleteTask={deleteTask} />
    </div>
  )
}