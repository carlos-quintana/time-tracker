import { useRef, useState } from "react";
import { Task, Project } from "../../../types";
import { useModal } from "../../../hooks/useModal";
import Modal from "../../Shared Components/Modal";
import usePopover from "../../../hooks/usePopover";
import Popover from "../../Shared Components/Popover";

/**
 * This variable will set the limit for the text input in the component. After the limit is reached it will display a warning to the user.
 * @type {Number}
 */
const MAX_NAME_LENGTH: number = 40;

type Props = {
    tasksList: Task[],
    projectsList: Project[],
    createProject: Function,
    editProject: Function,
    deleteProject: Function
}

/**
 * This component is used for the time being to show a list of the current existing projects, as well as the controls to do CRUD operations on them.
 * @param {Object} props - Component props object
 * @param {Array<Task>} props.tasksList - The list of existing tasks. This is used to check when deleting a Project if it has Tasks assigned to.
 * @param {Array<Project>} props.projectsList - The list of existing Projects to be displayed.
 * @param {function(String):Number} props.createProject - Callback function that will be fired when the form is used to create a new Project.
 * @param {function(Number,Project):void} props.editProject - Callback function that will be fired when the form is used to edit an existing Project.
 * @param {function(Number):void} props.deleteProject - Callback function that will be fired when any Project is deleted.
 */
const PanelProjects = ({ tasksList, projectsList, createProject, editProject, deleteProject }: Props) => {

    /** It's used in the controlled input field, and works to hold both the new Project name or an existing Project name, depending on wether the form is in creating or editing mode. */
    const [newProjectName, setNewProjectName] = useState<string>("");
    /** When this is true the form will be used to change the details of any selected Project. For the time being the only field it's the name */
    const [isEditing, setIsEditing] = useState<boolean>(false);
    /** When isEditing is true we need to keep track of the selected Project to edit */
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleNameChange = (event: any) => {
        // This line will take the input given by the user and remove any trailing white spaces. There is the special condition where the user uses one single space at the end to separate words though.
        let newName = event.target.value.slice(-1) === " " ?
            event.target.value.trim() + " " :
            event.target.value.trim();
        // Check the length of the name is valid. If the user exceeds this limit stop adding characters to the input and fire the notification
        if (newName.length > MAX_NAME_LENGTH) {
            openPopoverNameLengthError()
            setNewProjectName(newName.slice(0, MAX_NAME_LENGTH));
            return;
        }
        if (isOpenPopoverNameLengthError && newName.length < MAX_NAME_LENGTH)
            closePopoverNameLengthError()

        setNewProjectName(newName);
    }

    /** When the form is submitted in creation mode we validate the data for the new Project and then elevate this with the callback to submit the new Project. */
    const handleSubmitNewProject = (event: any) => {
        event.preventDefault();
        //      Form Validation
        let newName = newProjectName.trim();
        // Check for empty strings 
        if (newName === "") {
            popoverErrorMessage.current = "The name of the project cannot be empty!";
            openPopoverError();
            return
        }
        // Check for the length once again 
        if (newName.length > MAX_NAME_LENGTH) {
            popoverErrorMessage.current = "The name of the project is too long!";
            openPopoverError();
            return
        }
        // Check that the name of the new project is not taken
        if (projectsList.find(project => project.name === newName)) {
            popoverErrorMessage.current = "Another project already has this name";
            openPopoverError();
            return
        }
        createProject(newProjectName);
        setNewProjectName("");
    }

    /** When the form is submitted in editing we validate the data for the new Project and then elevate this with the callback to edit an existing Project. */
    const handleSubmitEditProject = (event: any) => {
        event.preventDefault();
        //      Form Validation
        let newName = newProjectName.trim();
        // Check for empty strings 
        if (newName === "") {
            popoverErrorMessage.current = "The name of the project cannot be empty!";
            openPopoverError();
            return
        }
        // Check for the length once again 
        if (newName.length > MAX_NAME_LENGTH) {
            popoverErrorMessage.current = "The name of the project is too long!";
            openPopoverError();
            return
        }
        // Check that the name of the new project is not taken
        if (projectsList.find(project => project.name === newName)) {
            // Unless the name taken is the same as the project the user is currently editing (Which means they did not modified the name).
            if (newName === projectsList.find(project => project.id === editingId)?.name) {
                setNewProjectName("");
                setIsEditing(false);
                setEditingId(null);
                return;
            } else {
                popoverErrorMessage.current = "Another project already has this name";
                openPopoverError();
                return
            }
        }
        if (editingId === null) return;
        let newProject: Project = { id: editingId, name: newProjectName };
        editProject(editingId, newProject);
        // Reset the form
        setNewProjectName("");
        setIsEditing(false);
        setEditingId(null);
    }

    const handleCancelEditProject = (event: any) => {
        event.preventDefault();
        setNewProjectName("");
        setIsEditing(false);
        setEditingId(null);
    }

    const handleDeleteProject = (id: number) => {
        // Before deleting the Project check if there are any Tasks that have this Project assigned. If there are then ask the user for confirmation.
        let totalTasksWithProject = tasksList.filter(task => task.project && task.project === id).length;
        // This is the message that will be shown in the body of the modal
        warningModalMessage.current = totalTasksWithProject > 0 ?
            `The project has ${totalTasksWithProject} tasks assigned. 
            The tasks will remain but their projects will be reset to none. 
            Are you sure you want to delete it?`
            :
            `Are you sure you want to delete this project?`;
        selectedProjectDeletion.current = id;
        openModalWarning();
    }

    const handleDeleteConfirmation = () => {
        if (selectedProjectDeletion.current !== null)
            deleteProject(selectedProjectDeletion.current);
    }

    /** These are the values for the warning modal that opens when a delete button is clicked */
    const { isOpen: isOpenWarning,
        openModal: openModalWarning,
        closeModal: closeModalWarning } = useModal(false);

    const warningModalMessage = useRef("");

    const selectedProjectDeletion = useRef<number | null>(null);

    /** This relates to the popover that will appear over the Project input controls when the max name length is reached */
    const { isOpenPopover: isOpenPopoverNameLengthError,
        openPopover: openPopoverNameLengthError,
        closePopover: closePopoverNameLengthError,
        setRefFocusElement: setRefFocusElementNameLengthError,
        popoverProps: popoverPropsNameLengthError } = usePopover();
    /** This relates to the popover that will appear over the Project input controls when the max name length is reached */
    const { openPopover: openPopoverError,
        closePopover: closePopoverError,
        setRefFocusElement: setRefFocusElementError,
        popoverProps: popoverPropsError } = usePopover();
    let popoverErrorMessage = useRef("An error happened");

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
                                className={`projects-input-text ${newProjectName.length >= MAX_NAME_LENGTH ? 'input--invalid' : ''}`}
                                value={newProjectName}
                                onChange={handleNameChange}
                                ref={setRefFocusElementNameLengthError} />
                            <Popover {...popoverPropsNameLengthError}>
                                <h1 className="popover__title popover__title--danger">Error</h1>
                                <p className="popover__text">The name you're trying to input is too long</p>
                            </Popover >
                            <div>
                                <input
                                    type="submit"
                                    value="Submit"
                                    className="button button-primary"
                                    ref={setRefFocusElementError}
                                />
                                <Popover {...popoverPropsError}>
                                    <h1 className="popover__title popover__title--danger">Error</h1>
                                    <p className="popover__text">{popoverErrorMessage.current}</p>
                                    <button className="button" onClick={closePopoverError}>Okay</button>
                                </Popover >
                                <button
                                    className="button"
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
                                className={`projects-input-text ${newProjectName.length >= MAX_NAME_LENGTH ? 'input--invalid' : ''}`}
                                value={newProjectName}
                                onChange={handleNameChange}
                                ref={setRefFocusElementNameLengthError} />
                            <Popover {...popoverPropsNameLengthError}>
                                <h1 className="popover__title popover__title--danger">Error</h1>
                                <p className="popover__text">The name you're trying to input is too long</p>
                            </Popover >
                            <input
                                type="submit"
                                value="Submit"
                                className="button button-primary"
                                ref={setRefFocusElementError}
                            />
                            <Popover {...popoverPropsError}>
                                <h1 className="popover__title popover__title--danger">Error</h1>
                                <p className="popover__text">{popoverErrorMessage.current}</p>
                                <button className="button" onClick={closePopoverError}>Okay</button>
                            </Popover >
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
            <Modal
                isOpen={isOpenWarning}
                closeModal={closeModalWarning}
                modalTitle="Warning"
                hasConfirmation={true}
                onConfirmationCallback={handleDeleteConfirmation}
            >
                <p>{warningModalMessage.current}</p>
            </Modal>
        </div>
    );
}

export default PanelProjects