import PanelInputs from "./InputPanel/PanelInputs"
import PanelTasks from "./TasksPanel/PanelTasks"
import PanelProjects from "./ProjectsPanel/PanelProjects"
import ControlsPanel from "./ControlsPanel/ControlsPanel"
// Material Icons
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
// Data Access Logic
import useDataAccess from "../hooks/useDataAccess";

/**
 * This is the main component for the application and the one that is at the top of the components hierarchy. This means that this will hold the state for the data of the application until a state manager is implemented, like Context or Redux.
 * It's state will include the list of tasks and projects the application is utilizing as well as the current running task that the timer works with.
*/
export default function App() {

  // Until a State Management Library is implemented, we send the corresponding state and state operations to their respective components. 
  const {
    // Task operations
    tasksList, createNewTask, editTask, deleteTask,
    // Current Task operations
    currentTask, setCurrentTask,
    // Project operations
    projectsList, createProject, editProject, deleteProject,
  } = useDataAccess()

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
      <footer className="footer">
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