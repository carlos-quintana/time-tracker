import { useState, useEffect, useRef } from "react"
import { Interval, Task, CurrentTask, Project } from "../types";

import PanelInputs from "./InputPanel/PanelInputs"
import PanelTasks from "./TasksPanel/PanelTasks"
import PanelProjects from "./ProjectsPanel/PanelProjects"
import ControlsPanel from "./ControlsPanel/ControlsPanel"
// JSON files that contain example dummy data to populate the application
import exampleTasksFromJSON from "../exampleTasks.json"
import exampleProjectsFromJSON from "../exampleProjects.json"
// Helper function to parse the example Tasks
import parseExampleTasks from "../helpers/parseExampleTasks"
// Material Icons
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LinkedInIcon from '@mui/icons-material/LinkedIn';


/**
 * This is the main component for the application and the one that is at the top of the components hierarchy. This means that this will hold the state for the data of the application until a state manager is implemented, like Context or Redux.
 * It's state will include the list of tasks and projects the application is utilizing as well as the current running task that the timer works with.
*/
export default function App() {

  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [currentTask, setCurrentTask] = useState<CurrentTask | null>(null);

  /** Since we have three useEffect hooks touching the Local Storage we want to avoid overwriting empty data on it when the application renders for the first time, so we use a flag to check if the application is being run for the first time, skip it and disable the flag (This two times, one for the tasks and one for the projects) */
  const firstRenderFlag = useRef([true, true, true]);

  /**
   * This useEffect hook is expected to run just once when the application loads. Here we will perform a check on the Local Storage:
   * - If there is no data in the Local Storage it means it's the first time of the user in the page so we load a set of example tasks and example projects from a couple JSON files.
   * - Otherwise we will assume there is existing data and load it onto the app.
   */
  useEffect(() => {
    let localStorageTasks = localStorage.getItem("tasksList")
    let localStorageCurrentTask = localStorage.getItem("currentTask")
    let localStorageProjects = localStorage.getItem("projectsList")
    if (localStorageTasks === null) {
      localStorage.clear()
      let exampleTasks = parseExampleTasks(exampleTasksFromJSON)
      let exampleProjects = exampleProjectsFromJSON
      localStorage.setItem('tasksList', JSON.stringify(exampleTasks));
      setTasksList(exampleTasks)
      localStorage.setItem('projectsList', JSON.stringify(exampleProjects));
      setProjectsList(exampleProjects)
    }
    else {
      setTasksList(JSON.parse(localStorageTasks))
      localStorageCurrentTask ?
        setCurrentTask(JSON.parse(localStorageCurrentTask)) :
        setCurrentTask(null)
      localStorageProjects ?
        setProjectsList(JSON.parse(localStorageProjects)) :
        setProjectsList([])
    }
  }, [])

  /** 
   * Everytime the list of tasks is updated, the Local Storage must be updated as well. This includes actions of creating, editing or removing tasks.
   * This is where REST operations and API calls will go 
   */
  useEffect(() => {
    // The first time the component is mounted we will ignore this hook and not set any data in Local Storage. Otherwise it would overwrite it with empty data (As the first useState hook wouldn't be executed yet)
    if (firstRenderFlag.current[0])
      firstRenderFlag.current[0] = false
    else
      localStorage.setItem('tasksList', JSON.stringify(tasksList));
  }, [tasksList])

  /**
   * In the same way we handle CRUD operations for the tasks state we will also do on the projects state.
   */
  useEffect(() => {
    // The first time the component is mounted we will ignore this hook and not set any data in Local Storage. Otherwise it would overwrite it with empty data (As the first useState hook wouldn't be executed yet)
    if (firstRenderFlag.current[1])
      firstRenderFlag.current[1] = false
    else
      localStorage.setItem('projectsList', JSON.stringify(projectsList));
  }, [projectsList])

  /**
   * In the same way we handle CRUD operations for the tasks state we will also do on the current task state.
   */
  useEffect(() => {
    // The first time the component is mounted we will ignore this hook and not set any data in Local Storage. Otherwise it would overwrite it with empty data (As the first useState hook wouldn't be executed yet)
    if (firstRenderFlag.current[2])
      firstRenderFlag.current[2] = false
    else
      localStorage.setItem('currentTask', JSON.stringify(currentTask));
  }, [currentTask])

  /**
   * @param {String} taskName - The name for the new task.
   * @param {Interval} taskInterval - The start and end timestamps for the new task.
   * @param {Number} [project] - The id for the project the new task is assigned to. May be undefined.
   */
  const createNewTask = (taskName: string, taskInterval: Interval, projectId: number) => {
    /** @type {Task}*/
    let newTaskObject: Task = {
      id: Date.now(),
      name: taskName,
      interval: taskInterval,
      project: projectId
    }
    setTasksList([newTaskObject, ...tasksList])
  }

  /**
   * @param {Number} idEdit - The id of the Task to update
   * @param {Task} newTask - A Task Object that will replace the Task with the given id
   */
  const editTask = (idEdit: number, newTask: Task) => {
    setTasksList(tasksList.map((task) => task.id === idEdit ? newTask : task))
  }

  /** @param {Number} idDelete - The id of the Task to delete */
  const deleteTask = (idDelete: number) => {
    setTasksList(tasksList.filter(el => el.id !== idDelete))
  }

  /**
   * @param {String} projectName - The name of the new project.
   * @returns {Number} - The generated Id of the newly created project.
   */
  const createProject = (projectName: string) => {
    /** @type {Project}*/
    let newProject: Project = {
      id: Date.now(),
      name: projectName
    }
    setProjectsList([newProject, ...projectsList])
    return newProject.id;
  }

  /**
   * @param {Number} idEdit - The id of the Project to update.
   * @param {Project} newProject - A Project Object that will replace the Project with the given id.
   */
  const editProject = (idEdit: number, newProject: Project) => {
    setProjectsList(
      projectsList.map(project =>
        project.id === idEdit ? newProject : project))
  }

  /**
   * This function will remove the project from the list of projects state, but also will go through the list of tasks and change any 'project' property assigned to this project to undefined.
   * @param {Number} idDelete - The id of the Task to delete
   */
  const deleteProject = (idDelete: number) => {
    setTasksList(
      tasksList.map(task =>
        task.project === idDelete ?
          { ...task, project: undefined } :
          task
      )
    )
    setProjectsList(projectsList.filter(el => el.id !== idDelete))
  }

  return (
    <>
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
      <PanelTasks
        tasksList={tasksList}
        editTask={editTask}
        deleteTask={deleteTask}
        currentTask={currentTask}
        setCurrentTask={setCurrentTask}
        projectsList={projectsList}
        createProject={createProject}
      />
      <PanelProjects
        tasksList={tasksList}
        projectsList={projectsList}
        createProject={createProject}
        editProject={editProject}
        deleteProject={deleteProject}
      />
      <section className="data-reset">
        <ControlsPanel />
      </section>
      <footer>
        <h4>This demo was created by Carlos Quintana</h4>
        <a href="https://carlos-quintana.github.io/" target="_blank" rel="noreferrer">
          <WorkOutlineIcon /> See my Web Portfolio and other Projects
        </a>
        <a href="https://github.com/carlos-quintana/" target="_blank" rel="noreferrer">
          <GitHubIcon /> See my GitHub Page
        </a>
        <a href="https://www.linkedin.com/in/carlos-quintana-dev/" target="_blank" rel="noreferrer">
          <LinkedInIcon /> Let's get in touch through LinkedIn
        </a>
      </footer>
    </>
  )
}