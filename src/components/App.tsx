import Header from "./Pages/Layout/Header";
import Footer from "./Pages/Layout/Footer";
import TasksPage from "./Pages/Tasks/TasksPage";
import PanelProjects from "./Pages/Projects/PanelProjects"
import ControlsPanel from "./Pages/Configuration/ControlsPanel"
// Data Access Logic
import useDataAccess from "../hooks/useDataAccess";
import { Routes, Route, Outlet, Link } from "react-router-dom";

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


      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <TasksPage
              tasksList={tasksList} createNewTask={createNewTask} editTask={editTask} deleteTask={deleteTask}
              currentTask={currentTask} setCurrentTask={setCurrentTask}
              projectsList={projectsList} createProject={createProject} />
          } />
          <Route path="projects" element={
            <PanelProjects
              tasksList={tasksList}
              projectsList={projectsList} createProject={createProject}
              editProject={editProject} deleteProject={deleteProject}
            />
          } />
          <Route path="options" element={<ControlsPanel />} />
          <Route path="about" element={
            <><p>Coming soon...</p></>
          } />
          <Route path="*" element={
            <>
              <p><strong>404</strong> There's nobody here</p>
            </>
          } />
        </Route>
      </Routes>


    </>
  )
}

function Layout() {
  return (
    <div>
      <Header />
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <Link to="/options">Options</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
      <Footer />
    </div>
  );
}
