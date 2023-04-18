/** @namespace Component_InputInterval */
import React, { useState } from "react"
import DropdownSearch from "../Shared Components/DropdownSearch"
import { useModal } from "../../hooks/useModal";
import Modal from "../Shared Components/Modal";
// eslint-disable-next-line no-unused-vars
const typedefs = require("./../types"); // JSDoc Type Definitions

/**
 * This variable will set the limit for the text input in the component. After the limit is reached it will display a warning to the user.
 * @type {Number}
 * @memberof Component_InputInterval
 */
const MAX_NAME_LENGTH = 60;

/**
 * @param {Object} props - Component props object
 * @param {function(String,typedefs.Interval,Number|undefined):void} props.handleSubmit - Callback function that will be fired when the form is submitted
 * @param {Array<typedefs.Project>} props.projectsList - The list of existing projects. This is used in the dropdown component that is used to select a project to assign the task to.
 * @param {function(String):Number} props.createProject - Callback function that will be fired when any of the input panels submits a new project (this is used inside of the Dropdown components)
 */
const InputCustomInterval = ({ handleSubmit: handleEntrySubmit, projectsList, createProject }) => {

    /** The name the new task will have. The corresponding input is controlled by this state. */
    const [taskName, setTaskName] = useState("");
    /** A string that has the shape of 'YYYY-MM-DD' used in the controlled input for the start date. */
    const [startDate, setStartDate] = useState("");
    /** A string that has the shape of 'YYYY-MM-DD' used in the controlled input for the end date. */
    const [endDate, setEndDate] = useState("");
    /** A string that has the shape of 'H:MM:SS' used in the controlled input for the start time. */
    const [startTime, setStartTime] = useState("");
    /** A string that has the shape of 'H:MM:SS' used in the controlled input for the end time. */
    const [endTime, setEndTime] = useState("");
    /** Keeps track of the project selected through the Dropdown component. */
    const [taskProject, setTaskProject] = useState(/**@type {null | Number}*/(null));
    /** This variable is used to change the props given to the Dropdown component which triggers a hook to reset it's selection to none. */
    const [dropdownResetTrigger, setDropdownResetTrigger] = useState(0);
    /** These are the controls for the modal that will pop up if there are errors with the form validation */
    const { isOpen, openModal, closeModal } = useModal(false);
    /** This is the dynamic message that will be shown in the modal. This is so we can use one single modal for all possible errors */
    const [modalText, setModalText] = useState("Error");

    const handleNameChange = event => {
        // This line will take the input given by the user and remove any trailing white spaces. There is the special condition where the user uses one single space at the end to separate words though.
        let newName = event.target.value.slice(-1) === " " ?
            event.target.value.trim() + " " :
            event.target.value.trim();
        // Check the length of the name is valid. If the user exceeds this limit stop adding characters to the input and fire the notification
        if (newName.length > MAX_NAME_LENGTH) {
            console.log("ERROR: The name you're trying to input is too long") // TODO: Implement a better notification
            setTaskName(newName.slice(0, MAX_NAME_LENGTH));
            return;
        }
        setTaskName(newName);
    }

    /** When the form is submitted validate the data for the new task and then elevate this with the callback to submit the new task. */
    const handleFormSubmit = (event) => {
        event.preventDefault();
        //      Validation
        //      Validate empty fields
        if (taskName.trim() === "") {
            triggerErrorModal("The name of the task cannot be empty");
            return;
        }
        if (!(startDate && startTime && endDate && endTime)) {
            triggerErrorModal("Please fill in all of the fields");
            return;
        }
        //      Validate start datetime is before end datetime
        let startTimestamp = new Date(startDate + " " + startTime).getTime();
        let endTimestamp = new Date(endDate + " " + endTime).getTime();
        if (startTimestamp >= endTimestamp) {
            triggerErrorModal("The times selected are not valid");
            return;
        }
        //      Callback to submit task
        // console.log(`Submitting new task with the name "${taskName}", starterTimestamp: ${startTimestamp}, endTimestamp:${endTimestamp}, taskProject:${taskProject}`);
        handleEntrySubmit(taskName, { start: startTimestamp, end: endTimestamp }, taskProject || undefined);
        //      Reset the form
        setTaskName("");
        setStartDate("");
        setEndDate("");
        setStartTime("");
        setEndTime("");
        setTaskProject(null); // The state in the panel for which project is selected
        setDropdownResetTrigger(dropdownResetTrigger + 1); // Trigger a useEffect hook in the child component to change the selected state to none
    }

    /**
     * This function is used when a project is created in the Dropdown component.
     * @param {String} newProjectName - The name for the new project.
     * @returns {Number} - The id of the newly created project
     */
    const handleProjectCreation = newProjectName => {
        let newProjectID = createProject(newProjectName);
        setTaskProject(newProjectID);
        return newProjectID;
    }

    /**
     * This function is used to change the modal text so it can be reutilized. For the time being there is no way the user could see this message without modifying the html to disable the browser's validation.
     * @param {string} message - The string to be put in the modal body
     */
    const triggerErrorModal = (message) => {
        setModalText(message);
        openModal();
    }

    return (
        <div>
            <form onSubmit={handleFormSubmit}>

                <div className="input-task-info">
                    <input id="taskName"
                        name="taskName"
                        type="text"
                        value={taskName}
                        onChange={handleNameChange}
                        placeholder="Input what you're working on"
                        required
                    />
                    {/* Task project */}
                    <DropdownSearch
                        defaultText={"Assign a project"}
                        searchPlaceholder={"Search a project or create a new one"}
                        optionsList={
                            projectsList.map(project => {
                                return { id: project.id, value: project.name }
                            })}
                        initialSelection={null}
                        onCreateCallback={handleProjectCreation}
                        onSelectCallback={setTaskProject}
                        resetTrigger={dropdownResetTrigger}
                    />
                </div>
                <div className="input-start-interval-container">
                    <label htmlFor="startDate">Start: </label>
                    <input
                        id="startDate"
                        name="startDate"
                        className="editable"
                        type="date"
                        value={startDate}
                        max={endDate ? endDate : undefined}
                        onChange={event => setStartDate(event.target.value)}
                        required
                    />
                    <input id="startTime"
                        name="startTime"
                        type="time"
                        value={startTime}
                        onChange={event => setStartTime(event.target.value)}
                        required
                    />
                </div>
                <div className="input-end-interval-container">
                    <label htmlFor="endDate">End: </label>
                    <input id="endDate"
                        name="endDate"
                        type="date"
                        value={endDate}
                        min={startDate ? startDate : undefined}
                        onChange={event => setEndDate(event.target.value)}
                        required
                    />
                    <input id="endTime"
                        name="endTime"
                        type="time"
                        value={endTime}
                        onChange={event => setEndTime(event.target.value)}
                        required
                    />
                </div>

                <div className="button-submit-task-container">
                    <input
                        className={`button button-submit-task ${taskName.trim() === "" ? "button button-disabled" : "button button-success"}`}
                        type="submit"
                        value="Submit"
                        // Disable the submit button if the text field doesn't have any text
                        disabled={taskName.trim() === ""} />
                </div>
            </form>

            <Modal
                // @ts-ignore
                isOpen={isOpen} closeModal={closeModal}
                modalTitle="Error">
                <p>{modalText}</p>
            </Modal>
        </div>
    )
}

export default InputCustomInterval