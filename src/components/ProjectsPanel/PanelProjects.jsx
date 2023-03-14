import React, { useState } from "react";

// eslint-disable-next-line no-unused-vars
const typedefs = require("./../types"); // JSDoc Type Definitions

/**
 * This variable will set the limit for the text input in the component. After the limit is reached it will display a warning to the user.
 * @type {Number}
 */
const MAX_NAME_LENGTH = 60;

/**
 * This component is used for the time being to show a list of the current existing projects, as well as the controls to do CRUD operations on them.
 * @param {Object} props - Component props object
 * @param {Array<typedefs.Task>} props.tasksList - The list of existing tasks. This is used to check when deleting a Project if it has Tasks assigned to.
 * @param {Array<typedefs.Project>} props.projectsList - The list of existing Projects to be displayed.
 * @param {function(String):Number} props.createProject - Callback function that will be fired when the form is used to create a new Project.
 * @param {function(Number,typedefs.Project):void} props.editProject - Callback function that will be fired when the form is used to edit an existing Project.
 * @param {function(Number):void} props.deleteProject - Callback function that will be fired when any Project is deleted.
 */
const PanelProjects = ({ tasksList, projectsList, createProject, editProject, deleteProject }) => {

    /** It's used in the controlled input field, and works to hold both the new Project name or an existing Project name, depending on wether the form is in creating or editing mode. */
    const [newProjectName, setNewProjectName] = useState("");
    /** When this is true the form will be used to change the details of any selected Project. For the time being the only field it's the name */
    const [isEditing, setIsEditing] = useState(false);
    /** When isEditing is true we need to keep track of the selected Project to edit */
    const [editingId, setEditingId] = useState(/**@type {null | number}*/(null));

    const handleNameChange = event => {
        // This line will take the input given by the user and remove any trailing white spaces. There is the special condition where the user uses one single space at the end to separate words though.
        let newName = event.target.value.slice(-1) === " " ?
            event.target.value.trim() + " " :
            event.target.value.trim();
        // Check the length of the name is valid. If the user exceeds this limit stop adding characters to the input and fire the notification
        if (newName.length > MAX_NAME_LENGTH) {
            console.log("ERROR: The name you're trying to input is too long") // TODO: Implement a better notification
            setNewProjectName(newName.slice(0, MAX_NAME_LENGTH));
            return;
        }
        setNewProjectName(newName);
    }

    /** When the form is submitted in creation mode we validate the data for the new Project and then elevate this with the callback to submit the new Project. */
    const handleSubmitNewProject = (event) => {
        event.preventDefault();
        //      Form Validation
        let newName = newProjectName.trim();
        // Check for empty strings 
        if (newName === "") {
            alert("Please input a valid name"); return; // TODO better notification system
        }
        // Check for the length once again 
        if (newName.length > MAX_NAME_LENGTH) {
            alert("The name is too long"); return; // TODO better notification system
        }
        // Check that the name of the new project is not taken
        if (projectsList.find(project => project.name === newName)) {
            alert("Another project already has this name"); return; // TODO better notification system
        }
        createProject(newProjectName);
        setNewProjectName("");
    }

    /** When the form is submitted in editing we validate the data for the new Project and then elevate this with the callback to edit an existing Project. */
    const handleSubmitEditProject = (event) => {
        event.preventDefault();
        //      Form Validation
        let newName = newProjectName.trim();
        // Check for empty strings 
        if (newName === "") {
            alert("Please input a valid name"); return; // TODO better notification system
        }
        // Check for the length once again 
        if (newName.length > MAX_NAME_LENGTH) {
            alert("The name is too long"); return; // TODO better notification system
        }
        // Check that the name of the new project is not taken
        if (projectsList.find(project => project.id === editingId)) {
            // Unless the name taken is the same as the project the user is currently editing (Which means they did not modified the name).
            if (newName === projectsList.find(project => project.id === editingId)?.name) {
                setNewProjectName("");
                setIsEditing(false);
                setEditingId(null);
                return;
            } else {
                alert("Another project already has this name"); return; // TODO better notification system
            }
        }
        if (editingId === null) return;
        /** @type {typedefs.Project} */
        let newProject = { id: editingId, name: newProjectName };
        editProject(editingId, newProject);
        // Reset the form
        setNewProjectName("");
        setIsEditing(false);
        setEditingId(null);
    }

    const handleCancelEditProject = event => {
        event.preventDefault();
        setNewProjectName("");
        setIsEditing(false);
        setEditingId(null);
    }

    const handleDeleteProject = id => {
        // Before deleting the Project check if there are any Tasks that have this Project assigned. If there are then ask the user for confirmation.
        let totalTasksWithProject = tasksList.filter(task => task.project && task.project === id).length;
        if (totalTasksWithProject) {
            if (!window.confirm(`The project has ${totalTasksWithProject} tasks assigned. \nThe tasks will remain but their projects will be reset to none. \nAre you sure you want to delete it?`)) // TODO better notification system
                return;
        }
        deleteProject(id);
    }

    return (
        <div className="projects-container">
            <h2>Projects list:</h2>
            {isEditing ?
                <>
                    <h4>Editing the project</h4>
                    <form onSubmit={handleSubmitEditProject}>
                        <div className="projects-input-container">
                            <input
                                type="text"
                                placeholder="Input a new name"
                                className="projects-input-text"
                                value={newProjectName}
                                onChange={handleNameChange} />
                            <div>
                                <input
                                    type="submit"
                                    value="Submit"
                                    className="button button-primary"
                                />
                                <button
                                    className="button button-warning"
                                    onClick={handleCancelEditProject}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </>
                :
                <>
                    <h4>Create a new project</h4>
                    <form onSubmit={handleSubmitNewProject}>
                        <div className="projects-input-container">
                            <input
                                type="text"
                                placeholder="Input the name of the new project"
                                className="projects-input-text"
                                value={newProjectName}
                                onChange={handleNameChange} />
                            <input
                                type="submit"
                                value="Submit"
                                className="button button-primary"
                            />
                        </div>
                    </form>
                </>}
            <ul className="projects-list">
                {projectsList?.map((project) =>
                    <li key={project.id}>
                        <span className="project-id">{project.id}</span>
                        <span className="project-name">{project.name}</span>
                        <button
                            className="button button-primary"
                            onClick={() => {
                                setIsEditing(true);
                                setEditingId(project.id);
                                setNewProjectName(project.name);
                            }} >
                            Edit
                        </button>
                        <button
                            className="button button-danger"
                            onClick={() => handleDeleteProject(project.id)}
                        >
                            Delete
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default PanelProjects