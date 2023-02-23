import React, { useState, useEffect, useRef } from "react"

import PanelInputs from "./InputPanel/PanelInputs"
import PanelTasks from "./DisplayPanel/PanelTasks"
import PanelProjects from "./ProjectsPanel/PanelProjects"
// JSON files that contain example dummy data to populate the application
import exampleTasksFromJSON from "../exampleTasks.json"
import exampleProjectsFromJSON from "../exampleProjects.json"
// eslint-disable-next-line no-unused-vars
const typedefs = require("./types"); // JSDoc Type Definitions

/**
 * This is the main component for the application and the one that is at the top of the components hierarchy. This means that this will hold the state for the data of the application until a state manager is implemented, like Context or Redux.
 * It's state will include the list of tasks and projects the application is utilizing as well as the current running task that the timer works with.
*/
export default function App() {

  /** @type {Array<typedefs.Task>}*/
  const INITIAL_TASKS_STATE = [];
  const [tasksList, setTasksList] = useState(INITIAL_TASKS_STATE);

  /** @type {Array<typedefs.Project>}*/
  const INITIAL_PROJECTS_STATE = [];
  const [projectsList, setProjectsList] = useState(INITIAL_PROJECTS_STATE);

  /** @type {typedefs.CurrentTask | null}*/
  const INITIAL_CURRENT_TASK_STATE = null;
  const [currentTask, setCurrentTask] = useState(INITIAL_CURRENT_TASK_STATE);

  /** Since we have two useEffect hooks touching the Local Storage we want to avoid overwriting empty data on it when the application renders for the first time, so we use a flag to check if the application is being run for the first time, skip it and disable the flag (This two times, one for the tasks and one for the projects) */
  const firstRenderFlag = useRef([true, true, true]);

  /**
   * This useEffect hook is expected to run just once when the application loads. Here we will perform a check on the Local Storage:
   * - If there is no data in the Local Storage it means it's the first time of the user in the page so we load a set of example tasks and example projects from a couple JSON files.
   * - Otherwise we will assume there is existing data and load it onto the app.
   */
  useEffect(() => {
    // console.log("> Entering the initial useEffect")
    let localStorageTasks = localStorage.getItem("tasksList")
    let localStorageCurrentTask = localStorage.getItem("currentTask")
    let localStorageProjects = localStorage.getItem("projectsList")
    // console.log({ localStorageTasks })
    // console.log({ localStorageCurrentTask })
    // console.log({ localStorageProjects })
    if (localStorageTasks === null) {
      // console.log("+ The stuff in local storage is NULL, will store example tasks:")
      localStorage.clear()
      let exampleTasks = exampleTasksFromJSON.reverse()
      let exampleProjects = exampleProjectsFromJSON
      // console.log("The example tasks to be added are:")
      // console.log({ exampleTasks })
      localStorage.setItem('tasksList', JSON.stringify(exampleTasks));
      setTasksList(exampleTasks)
      // console.log("The example projects to be added are:")
      // console.log({ exampleProjects })
      localStorage.setItem('projectsList', JSON.stringify(exampleProjects));
      setProjectsList(exampleProjects)
      // console.log("Stored the example tasks in the local storage and set the state")
      // console.log({ localStorageTasks: localStorage.getItem("tasksList") })
    }
    else {
      // console.log("- The stuff in local storage is NOT NULL, will update state with its current information")
      setTasksList(JSON.parse(localStorageTasks))
      localStorageCurrentTask ?
        setCurrentTask(JSON.parse(localStorageCurrentTask)) :
        setCurrentTask(null)
      localStorageProjects ?
        setProjectsList(JSON.parse(localStorageProjects)) :
        setProjectsList([])
    }
    // console.log("< Exiting the initial useEffect")
  }, [])

  /** 
   * Everytime the list of tasks is updated, the Local Storage must be updated as well. This includes actions of creating, editing or removing tasks.
   * This is where REST operations and API calls will go 
   */
  useEffect(() => {
    // console.log("> Entering the tasksList useEffect")
    // console.log({ localStorageTasks: localStorage.getItem("tasksList") })
    // console.log({ currentStateTasks: tasksList })
    // console.log({ firstRenderFlag: firstRenderFlag.current })
    // The first time the component is mounted we will ignore this hook and not set any data in Local Storage. Otherwise it would overwrite it with empty data (As the first useState hook wouldn't be executed yet)
    if (firstRenderFlag.current[0]) {
      // console.log("> firstRenderFlag is active, we skip")
      firstRenderFlag.current[0] = false
    } else {
      // console.log("Setting the tasksList state")
      localStorage.setItem('tasksList', JSON.stringify(tasksList));
    }
    // console.log({ localStorageTasks: localStorage.getItem("tasksList") })
    // console.log("< Exiting the tasksList useEffect")
  }, [tasksList])

  /**
   * In the same way we handle CRUD operations for the tasks state we will also do on the projects state.
   */
  useEffect(() => {
    // console.log("> Entering the projectsList useEffect")
    // console.log({ localStorageProjects: localStorage.getItem("projectsList") })
    // console.log({ currentStateProjects: projectsList })
    // The first time the component is mounted we will ignore this hook and not set any data in Local Storage. Otherwise it would overwrite it with empty data (As the first useState hook wouldn't be executed yet)
    if (firstRenderFlag.current[1]) {
      // console.log("> firstRenderFlag is active, we skip")
      firstRenderFlag.current[1] = false
    } else {
      // console.log("Setting the projectsList state")
      localStorage.setItem('projectsList', JSON.stringify(projectsList));
    }
    // console.log("< Exiting the projectsList useEffect")
  }, [projectsList])

  /**
   * In the same way we handle CRUD operations for the tasks state we will also do on the current task state.
   */
  useEffect(() => {
    // console.log("> (App) Entering the currentTask useEffect")
    // console.log({ currentTask: localStorage.getItem("currentTask") })
    // console.log({ currentTask: currentTask })
    // The first time the component is mounted we will ignore this hook and not set any data in Local Storage. Otherwise it would overwrite it with empty data (As the first useState hook wouldn't be executed yet)
    if (firstRenderFlag.current[2]) {
      // console.log("> firstRenderFlag is active, we skip")
      firstRenderFlag.current[2] = false
    } else {
      localStorage.setItem('currentTask', JSON.stringify(currentTask));
      // console.log({ currentTask: localStorage.getItem("currentTask") })
    }
    // console.log("< (App) Exiting the currentTask useEffect")
  }, [currentTask])


  /**
   * @param {String} taskName - The name for the new task.
   * @param {typedefs.Interval} taskInterval - The start and end timestamps for the new task.
   * @param {Number} [project] - The id for the project the new task is assigned to. May be undefined.
   */
  const createNewTask = (taskName, taskInterval, project) => {
    // console.log("> Inside createNewTask")
    // console.log({ tasksList })
    /** @type {typedefs.Task}*/
    let newTaskObject = {
      id: Date.now(),
      name: taskName,
      interval: taskInterval,
      project: project
    }
    setTasksList([newTaskObject, ...tasksList])
  }

  /**
   * @param {Number} idEdit - The id of the Task to update
   * @param {typedefs.Task} newTask - A Task Object that will replace the Task with the given id
   */
  const editTask = (idEdit, newTask) => {
    setTasksList(tasksList.map((task) => task.id === idEdit ? newTask : task))
  }

  /** @param {Number} idDelete - The id of the Task to delete */
  const deleteTask = idDelete => {
    setTasksList(tasksList.filter(el => el.id !== idDelete))
  }

  /**
   * @param {String} projectName - The name of the new project.
   * @returns {Number} - The generated Id of the newly created project.
   */
  const createProject = (projectName) => {
    /** @type {typedefs.Project}*/
    let newProject = {
      id: Date.now(),
      name: projectName
    }
    setProjectsList([newProject, ...projectsList])
    return newProject.id;
  }

  /**
   * @param {Number} idEdit - The id of the Project to update.
   * @param {typedefs.Project} newProject - A Project Object that will replace the Project with the given id.
   */
  const editProject = (idEdit, newProject) => {
    setProjectsList(
      projectsList.map(project =>
        project.id === idEdit ? newProject : project))
  }

  /**
   * This function will remove the project from the list of projects state, but also will go through the list of tasks and change any 'project' property assigned to this project to undefined.
   * @param {Number} idDelete - The id of the Task to delete
   */
  const deleteProject = idDelete => {
    // console.log(`Deleting the project with id ${idDelete}`)
    // console.log("Removing the project from the tasks list")
    setTasksList(
      tasksList.map(task =>
        task.project === idDelete ?
          { ...task, project: undefined } :
          task
      )
    )
    // console.log("Filtering the list of projects")
    setProjectsList(projectsList.filter(el => el.id !== idDelete))
  }

  /**
   * This function reloads the application and restores all of the dummy data in the example files. We do this by clearing the Local Storage, which the application will interpret as a new user entering for the first time.
   */
  const resetData = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div>
      <header>
        <h2>Time Tracker application</h2>
      </header>
      <PanelInputs
        createNewTask={createNewTask}
        currentTask={currentTask}
        setCurrentTask={setCurrentTask}
        projectsList={projectsList}
        createProject={createProject}
      />
      <hr />
      <PanelTasks
        tasksList={tasksList}
        editTask={editTask}
        deleteTask={deleteTask}
        currentTask={currentTask}
        setCurrentTask={setCurrentTask}
        projectsList={projectsList}
        createProject={createProject}
      />
      <hr />
      <PanelProjects
        projectsList={projectsList}
        createProject={createProject}
        editProject={editProject}
        deleteProject={deleteProject}
      />
      <button
        className="button button-warning"
        onClick={resetData}
      >
        Reset the LocalStorage
      </button>
    </div>
  )
}