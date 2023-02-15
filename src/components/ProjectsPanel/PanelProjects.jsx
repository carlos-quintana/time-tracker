import { useState } from "react";

const PanelProjects = ({ projectsList, createProject, editProject, deleteProject }) => {

    const [newProjectName, setNewProjectName] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)

    const handleSubmitNewProject = (e) => {
        e.preventDefault()
        createProject(newProjectName)
        setNewProjectName("")
    }
    
    const handleSubmitEditProject = (e) => {
        e.preventDefault()
        editProject(editingId, newProjectName)
        setNewProjectName("")
        setIsEditing(false)
        setEditingId(null)
    }

    return (
        <div>
            <h3>Projects list:</h3>
            {isEditing ?
                <>
                    <h5>Editing the project</h5>
                    <form onSubmit={handleSubmitEditProject}>
                        <input type="text"
                            placeholder="Input a new name" value={newProjectName}
                            onChange={e => setNewProjectName(e.target.value)} />
                        <input type="submit" value="Submit" />
                    </form>
                    <button onClick={() => { setIsEditing(false); setEditingId(null) }}>Cancel</button></>
                :
                <>
                    <h5>Create a new project</h5>
                    <form onSubmit={handleSubmitNewProject}>
                        <input type="text"
                            placeholder="Input the name of the new project"
                            value={newProjectName}
                            onChange={e => setNewProjectName(e.target.value)} />
                        <input type="submit" value="Submit" />
                    </form></>
            }
            <ul>
                {
                    projectsList?.map((project, i) =>
                        <li key={i}>
                            <span>{project.id} | {project.name} | </span>
                            <button onClick={() => deleteProject(project.id)}>Delete</button>
                            <button onClick={() => {
                                setIsEditing(true)
                                setEditingId(project.id)
                                setNewProjectName(project.name)
                            }} >Edit</button>
                        </li>
                    )
                }
            </ul>
        </div>
    );
}

export default PanelProjects