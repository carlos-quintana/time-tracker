import React, { useState } from "react";

// eslint-disable-next-line no-unused-vars
const typedefs = require("./../types"); // JSDoc Type Definitions

/**
 * This component is used for the time being to show a list of the current existing projects, as well as the controls to do CRUD operations on them.
 * @param {Object} props - Component props object
 * @param {Array} props.projectsList - The list of existing projects. This is used in the Dropdown component that is used to select a project to assign the task to.
 * @param {function(String):Number} props.createProject - Callback function that will be fired when the form is used to create a new Project.
 * @param {function(Number,typedefs.Project):void} props.editProject - Callback function that will be fired when the form is used to edit an existing Project.
 * @param {function(Number):void} props.deleteProject - Callback function that will be fired when any Project is deleted.
 */
const PanelProjects = ({ projectsList, createProject, editProject, deleteProject }) => {

    /** It's used in the controlled input field, and works to hold both the new Project name or an existing Project name, depending on wether the form is in creating or editing mode. */
    const [newProjectName, setNewProjectName] = useState("");
    /** When this is true the form will be used to change the details of any selected Project. For the time being the only field it's the name */
    const [isEditing, setIsEditing] = useState(false);
    /** When isEditing is true we need to keep track of the selected Project to edit */
    const [editingId, setEditingId] = useState(null);

    /** When the form is submitted in creation mode we validate the data for the new Project and then elevate this with the callback to submit the new Project. */
    const handleSubmitNewProject = (event) => {
        event.preventDefault();
        createProject(newProjectName);
        setNewProjectName("");
    }

    /** When the form is submitted in editing we validate the data for the new Project and then elevate this with the callback to edit an existing Project. */
    const handleSubmitEditProject = (event) => {
        event.preventDefault();
        if (editingId === null) return;
        /** @type {typedefs.Project} */
        let newProject = { id: editingId, name: newProjectName };
        editProject(editingId, newProject);
        // Reset the form
        setNewProjectName("");
        setIsEditing(false);
        setEditingId(null);
    }

    return (
        <div>
            <h3>Projects list:</h3>
            {isEditing ?
                <>
                    <h5>Editing the project</h5>
                    <form onSubmit={handleSubmitEditProject}>
                        <input type="text"
                            placeholder="Input a new name"
                            value={newProjectName}
                            onChange={e => setNewProjectName(e.target.value)} />
                        <input type="submit" value="Submit" />
                    </form>
                    <button onClick={() => { setIsEditing(false); setEditingId(null); }}>
                        Cancel
                    </button>
                </>
                :
                <>
                    <h5>Create a new project</h5>
                    <form onSubmit={handleSubmitNewProject}>
                        <input type="text"
                            placeholder="Input the name of the new project"
                            value={newProjectName}
                            onChange={e => setNewProjectName(e.target.value)} />
                        <input type="submit" value="Submit" />
                    </form>
                </>}
            <ul>
                {projectsList?.map((project) =>
                    <li key={project.id}>
                        <span>{project.id} | {project.name} | </span>
                        <button onClick={() => deleteProject(project.id)}>
                            Delete
                        </button>
                        <button onClick={() => {
                            setIsEditing(true);
                            setEditingId(project.id);
                            setNewProjectName(project.name);
                        }} >
                            Edit
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default PanelProjects