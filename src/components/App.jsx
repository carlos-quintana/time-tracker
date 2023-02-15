import React, { useState, useEffect } from "react"
import exampleTasksFromJSON from "../exampleTasks.json"
import exampleProjectsFromJSON from "../exampleProjects.json"
import PanelInputs from "./InputPanel/PanelInputs"
import PanelData from "./DisplayPanel/PanelData"

// The purpose of initializing the state to null is so that the useEffect with the tasksList as dependencies does not run when the component is mounted, as it would keep overwriting the Local Storage with empty data. This will also work when in Strict Mode
const INITIAL_TASKS_STATE = null
const INITIAL_CURRENT_TASK_STATE = false
const INITIAL_PROJECTS_STATE = null

export default function App() {
  // For the time being the LocalStorage will be used a data base
  const [tasksList, setTasksList] = useState(INITIAL_TASKS_STATE)
  // This currentRunningTask referes to the task that is running in the timer, and the program will keep track even when it's closed, as using intervals we only need to know when it started. This currentRunningTask will have the shape of {name: String, timestampStart: int}
  const [currentRunningTask, setCurrentRunningTask] = useState(INITIAL_CURRENT_TASK_STATE)
  //
  const [projectsList, setProjectsList] = useState(INITIAL_PROJECTS_STATE)

  // At the first loading of the app we will perform a check on the Local storage:
  // If there is no data in the Local storage it means it's the first time of the user in the page so we load a set of example tasks from a json file
  // Otherwise we will assume there is existing data and load it onto the app, effectively mantaining data over page reloads
  useEffect(() => {
    // console.log("> Entering the initial useEffect")
    let localStorageTasks = localStorage.getItem("tasksList")
    let localStorageCurrentTask = localStorage.getItem("currentTask")
    let localStorageProjects = localStorage.getItem("projectsList")
    // console.log("Current stuff in the local Storage:")
    // console.log({ localStorageTasks })
    // console.log({ localStorageCurrentTask })
    if (localStorageTasks === null) {
      // console.log("+ The stuff in local storage is NULL, will store example tasks:")
      localStorage.clear()
      let exampleTasks = exampleTasksFromJSON.reverse()
      let exampleProjects = exampleProjectsFromJSON
      // console.log("The example tasks to be added are:")
      // console.log({ exampleTasks })
      localStorage.setItem('tasksList', JSON.stringify(exampleTasks));
      setTasksList(exampleTasks)
      localStorage.setItem('projectsList', JSON.stringify(exampleProjects));
      setProjectsList(exampleProjects)
      // console.log("Stored the example tasks in the local storage and set the state")
      // console.log({ localStorageTasks: localStorage.getItem("tasksList") })
    }
    else {
      // console.log("- The stuff in local storage is NOT NULL, will update state with its current tasks:")
      setTasksList(JSON.parse(localStorageTasks))
      setCurrentRunningTask(JSON.parse(localStorageCurrentTask))
      setProjectsList(JSON.parse(localStorageProjects))
    }
    // console.log("< Exiting the initial useEffect")
  }, [])

  // Everytime the list of tasks is updated, the Local Storage shall be updated as well. This includes
  // actions of creating, editing or removing tasks. This is where REST operations will go
  useEffect(() => {
    // console.log("> Entering the tasksList useEffect")
    // console.log({ localStorageTasks: localStorage.getItem("tasksList") })
    // console.log({ currentStateTasks: tasksList })
    // The first time the component is mounted we will ignore this hook and not set any data in local storage
    if (tasksList !== INITIAL_TASKS_STATE) {
      localStorage.setItem('tasksList', JSON.stringify(tasksList));
      // console.log({ localStorageTasks: localStorage.getItem("tasksList") })
      // console.log({ currentStateTasks: tasksList })
    }
    // console.log("< Exiting the tasksList useEffect")
  }, [tasksList])

  useEffect(() => {
    // console.log("> (App) Entering the currentRunningTask useEffect")
    // console.log({ currentTask: localStorage.getItem("currentTask") })
    // console.log({ currentRunningTask: currentRunningTask })
    // The first time the component is mounted we will ignore this hook and not set any data in local storage
    if (currentRunningTask !== INITIAL_CURRENT_TASK_STATE) {
      localStorage.setItem('currentTask', JSON.stringify(currentRunningTask));
      // console.log({ currentTask: localStorage.getItem("currentTask") })
      // console.log({ currentRunningTask: currentRunningTask })
    }
    // console.log("< (App) Exiting the currentRunningTask useEffect")
  }, [currentRunningTask])

  useEffect(() => {
    if (projectsList !== INITIAL_PROJECTS_STATE)
      localStorage.setItem('projectsList', JSON.stringify(projectsList));
  }, [projectsList])

  // Function that acts as the Create data whenever the new task input is submitted
  const createNewTask = (taskName, taskInterval) => {
    // console.log("Inside createNewTask")
    // console.log({ tasksList })
    let newTaskObject = {
      id: Date.now(),
      name: taskName,
      interval: taskInterval,
      formattedInterval: { start: new Date(taskInterval.start), end: new Date(taskInterval.end) }
    }
    // console.log({ tasksList })
    setTasksList([newTaskObject, ...tasksList])
  }

  const editTask = (idEdit, newTask) => {
    // console.log(`Editing the task with id ${idEdit}`)
    // console.log(newTask)
    setTasksList(tasksList.map(task => task.id === idEdit ? newTask : task))
  }

  const deleteTask = id => {
    // console.log(`Deleting the task with id ${id}`)
    setTasksList(tasksList.filter(el => el.id !== id))
  }

  const createProject = (newProjectName) => {
    let newProjectId = Date.now();
    setProjectsList([{
      id: newProjectId,
      name: newProjectName
    }, ...projectsList])
    return newProjectId;
  }
  const editProject = (idEdit, newProject) => {
    setProjectsList(projectsList.map(project => project.id === idEdit ? {id: idEdit, name: newProject} : project))
  }
  const deleteProject = id => {
    console.log(`Deleting the project with id ${id}`)
    console.log("Removing the project from the tasks list")
    setTasksList(
      tasksList.map(task => {
        if (task.project === id)
          return {...task, project: undefined}
        return task
      }))
    setProjectsList(projectsList.filter(el => el.id !== id))
    console.log("Filtered the list of projects")
  }

  const resetAppData = () => {
    // console.warn("Resetting the Local Storage data stored in the app")
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div>
      <h2>Time Tracker application</h2>
      <PanelInputs
        createNewTask={createNewTask}
        currentRunningTask={currentRunningTask}
        setCurrentRunningTask={setCurrentRunningTask}
      />
      <PanelData
        tasksList={tasksList !== INITIAL_TASKS_STATE ? tasksList : []}
        editTask={editTask}
        deleteTask={deleteTask}
        currentRunningTask={currentRunningTask}
        setCurrentRunningTask={setCurrentRunningTask}
        projectsList={projectsList}
        createProject={createProject}
      />
      <hr/>
      <PanelProjects
        projectsList={projectsList}
        createProject={createProject}
        editProject={editProject}
        deleteProject={deleteProject}
      />
      <button onClick={resetAppData}> Reset the LocalStorage </button>
    </div>
  )
}