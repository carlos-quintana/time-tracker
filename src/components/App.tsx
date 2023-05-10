import { Routes, Route } from "react-router-dom";

import Layout from "./Pages/Layout/Layout";
import TasksPage from "./Pages/Tasks/TasksPage";
import PanelProjects from "./Pages/Projects/PanelProjects"
import OptionsPage from "./Pages/Options/OptionsPage";
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
      <Routes>
        <Route path="/" element={
          <Layout />
        }
        >
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
          <Route path="options" element={
            <OptionsPage />
          } />
          <Route path="about" element={
            <><p>Coming soon...</p></>
          } />
          <Route path="*" element={
            <><p><strong>404</strong> There's nobody here</p></>
          } />
        </Route>
      </Routes>
    </>
  )
}