import Header from "./Header";
import Footer from "./Footer";
import PanelInputs from "./InputPanel/PanelInputs"
import PanelTasks from "./TasksPanel/PanelTasks"
import PanelProjects from "./ProjectsPanel/PanelProjects"
import ControlsPanel from "./ControlsPanel/ControlsPanel"
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
      <Header />
      <PanelInputs
        createNewTask={createNewTask}
        currentTask={currentTask} setCurrentTask={setCurrentTask}
        projectsList={projectsList} createProject={createProject}
      />
      <PanelTasks
        tasksList={tasksList} editTask={editTask} deleteTask={deleteTask}
        currentTask={currentTask} setCurrentTask={setCurrentTask}
        projectsList={projectsList} createProject={createProject}
      />
      <PanelProjects
        tasksList={tasksList}
        projectsList={projectsList} createProject={createProject} 
        editProject={editProject} deleteProject={deleteProject}
      />
      <ControlsPanel />
      <Footer />
    </>
  )
}