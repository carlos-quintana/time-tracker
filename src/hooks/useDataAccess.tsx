import { useState, useEffect, useRef } from "react"
import { CurrentTask, Interval, Project, Task } from "../types";
import Cookies from 'universal-cookie';
// JSON files that contain example dummy data to populate the application
import exampleTasksFromJSON from "../exampleTasks.json"
import exampleProjectsFromJSON from "../exampleProjects.json"
// Helper function to parse the example Tasks
import parseExampleTasks from "../helpers/parseExampleTasks"

export default function useDataAccess() {

    const [tasksList, setTasksList] = useState<Task[]>([]);
    const [projectsList, setProjectsList] = useState<Project[]>([]);
    const [currentTask, setCurrentTask] = useState<CurrentTask | null>(null);

    /** Since we have three useEffect hooks touching the Local Storage we want to avoid overwriting empty data on it when the application renders for the first time, so we use a flag to check if the application is being run for the first time, skip it and disable the flag (This two times, one for the tasks and one for the projects) */
    const firstRenderFlag = useRef([true, true, true]);

    /** We're going to use a cookie to automatically reset all the data after 12 hours. */
    const cookies = new Cookies();
    const cookieMaxAge = 60*60*12

    /**
     * This useEffect hook is expected to run just once when the application loads. Here we will perform a check on the Local Storage:
     * - If there is no data in the Local Storage it means it's the first time of the user in the page so we load a set of example tasks and example projects from a couple JSON files.
     * - Otherwise we will assume there is existing data and load it onto the app.
     */
    useEffect(() => {
        // Here we would retrieve the data from the API with a fetch request, after receiving it we'll compare it to the local storage and if they are inconsitent with each other the user would be presented with a prompt to choose which data to prioritize, as we don't expect a server to be up most of the time
        let localStorageTasks = localStorage.getItem("tasksList");
        let localStorageCurrentTask = localStorage.getItem("currentTask");
        let localStorageProjects = localStorage.getItem("projectsList");
        // Reset the data if the localStorageTasks value is null. Not to be confused with having zero tasks, as the value localStorageTasks would exist as an empty array. This means that the localStorage does not have this key. 
        let isLocalStorageEmpty = localStorageTasks === null;
        // Also reset the data if the cookie has expired and the user hasn't disabled the auto-reset feature.
        let isCookieExpired = !cookies.get('autoReset') && !localStorage.getItem('disableAutoReset');
        if (isLocalStorageEmpty || isCookieExpired) {
            cookies.set('autoReset', 'true', { maxAge: cookieMaxAge })
            localStorage.clear();
            let exampleTasks = parseExampleTasks(exampleTasksFromJSON);
            let exampleProjects = exampleProjectsFromJSON;
            localStorage.setItem('tasksList', JSON.stringify(exampleTasks));
            setTasksList(exampleTasks);
            localStorage.setItem('projectsList', JSON.stringify(exampleProjects));
            setProjectsList(exampleProjects);
        }
        else {
            setTasksList(JSON.parse(localStorageTasks ?? '[]'))
            localStorageCurrentTask ?
                setCurrentTask(JSON.parse(localStorageCurrentTask)) :
                setCurrentTask(null);
            localStorageProjects ?
                setProjectsList(JSON.parse(localStorageProjects)) :
                setProjectsList([]);
        }
    }, []);

    /** 
     * Everytime the list of tasks is updated, the Local Storage must be updated as well. This includes actions of creating, editing or removing tasks.
     * This is where REST operations and API calls will go 
     */
    useEffect(() => {
        // The first time the component is mounted we will ignore this hook and not set any data in Local Storage. Otherwise it would overwrite it with empty data (As the first useState hook wouldn't be executed yet)
        if (firstRenderFlag.current[0])
            firstRenderFlag.current[0] = false;
        else
            localStorage.setItem('tasksList', JSON.stringify(tasksList));
    }, [tasksList])

    /**
     * In the same way we handle CRUD operations for the tasks state we will also do on the projects state.
     */
    useEffect(() => {
        // The first time the component is mounted we will ignore this hook and not set any data in Local Storage. Otherwise it would overwrite it with empty data (As the first useState hook wouldn't be executed yet)
        if (firstRenderFlag.current[1])
            firstRenderFlag.current[1] = false;
        else
            localStorage.setItem('projectsList', JSON.stringify(projectsList));
    }, [projectsList])

    /**
     * In the same way we handle CRUD operations for the tasks state we will also do on the current task state.
     */
    useEffect(() => {
        // The first time the component is mounted we will ignore this hook and not set any data in Local Storage. Otherwise it would overwrite it with empty data (As the first useState hook wouldn't be executed yet)
        if (firstRenderFlag.current[2])
            firstRenderFlag.current[2] = false;
        else
            localStorage.setItem('currentTask', JSON.stringify(currentTask));
    }, [currentTask])

    /**
     * @param {String} taskName - The name for the new task.
     * @param {Interval} taskInterval - The start and end timestamps for the new task.
     * @param {Number} [project] - The id for the project the new task is assigned to. May be undefined.
     */
    const createNewTask = (taskName: string, taskInterval: Interval, projectId: number) => {
        // @TODO: API call would go here
        let newTaskObject: Task = {
            id: Date.now(),
            name: taskName,
            interval: taskInterval,
            project: projectId
        };
        setTasksList([newTaskObject, ...tasksList]);
    }

    /**
     * @param {Number} idEdit - The id of the Task to update
     * @param {Task} newTask - A Task Object that will replace the Task with the given id
     */
    const editTask = (idEdit: number, newTask: Task) => {
        // @TODO: API call would go here
        setTasksList(tasksList.map((task) => task.id === idEdit ? newTask : task));
    }

    /** @param {Number} idDelete - The id of the Task to delete */
    const deleteTask = (idDelete: number) => {
        // @TODO: API call would go here
        setTasksList(tasksList.filter(el => el.id !== idDelete));
    }

    /**
     * @param {String} projectName - The name of the new project.
     * @returns {Number} - The generated Id of the newly created project.
     */
    const createProject = (projectName: string) => {
        // @TODO: API call would go here
        /** @type {Project}*/
        let newProject: Project = {
            id: Date.now(),
            name: projectName
        };
        setProjectsList([newProject, ...projectsList]);
        return newProject.id;
    }

    /**
     * @param {Number} idEdit - The id of the Project to update.
     * @param {Project} newProject - A Project Object that will replace the Project with the given id.
     */
    const editProject = (idEdit: number, newProject: Project) => {
        // @TODO: API call would go here
        setProjectsList(
            projectsList.map(project =>
                project.id === idEdit ? newProject : project));
    }

    /**
     * This function will remove the project from the list of projects state, but also will go through the list of tasks and change any 'project' property assigned to this project to undefined.
     * @param {Number} idDelete - The id of the Task to delete
     */
    const deleteProject = (idDelete: number) => {
        // @TODO: API call would go here
        setTasksList(
            tasksList.map(task =>
                task.project === idDelete ?
                    { ...task, project: undefined } :
                    task
            )
        );
        setProjectsList(projectsList.filter(el => el.id !== idDelete));
    }

    /** This function overrites all data to an empty state */
    const clearAllData = () => {
        setTasksList([]);
        setCurrentTask(null);
        setProjectsList([]);
    }

    return {
        tasksList,
        createNewTask,
        editTask,
        deleteTask,
        currentTask,
        setCurrentTask,
        projectsList,
        createProject,
        editProject,
        deleteProject,
        clearAllData
    };

}