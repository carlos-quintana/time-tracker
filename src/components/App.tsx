import Header from "./Pages/Layout/Header";
import Footer from "./Pages/Layout/Footer";
import TasksPage from "./Pages/Tasks/TasksPage";
import PanelProjects from "./Pages/Projects/PanelProjects"
import ControlsPanel from "./Pages/Configuration/ControlsPanel"
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
      <TasksPage
        tasksList={tasksList} createNewTask={createNewTask} editTask={editTask} deleteTask={deleteTask}
        currentTask={currentTask} setCurrentTask={setCurrentTask}
        projectsList={projectsList} createProject={createProject} />
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