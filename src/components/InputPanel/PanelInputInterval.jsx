import React, { useState } from "react"
import DropdownSearch from "../Shared Components/DropdownSearch"
// eslint-disable-next-line no-unused-vars
const typedefs = require("./../types"); // JSDoc Type Definitions

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

    /** When the form is submitted validate the data for the new task and then elevate this with the callback to submit the new task. */
    const handleFormSubmit = (event) => {
        event.preventDefault();
        //      Validation
        //      Validate empty fields
        //      TODO: Validate task name
        if (!(startDate && startTime && endDate && endTime)) {
            alert("Please fill in all of the fields");
            return;
        }
        //      Validate start datetime is before end datetime
        let startTimestamp = new Date(startDate + " " + startTime).getTime();
        let endTimestamp = new Date(endDate + " " + endTime).getTime();
        if (startTimestamp >= endTimestamp) {
            alert("The times selected are not valid"); // TODO: A better notifications system (maybe modals or tooltips)
            return;
        }
        //      Callback to submit task
        console.log(`Submitting new task with the name "${taskName}", starterTimestamp: ${startTimestamp}, endTimestamp:${endTimestamp}, taskProject:${taskProject}`);
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
    const handleProjectCreation = newProjectName =>
        createProject(newProjectName);

    return (
        <div>
            <p>Input the custom dates and times for the new task:</p>
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="taskName">Name of the task: </label>
                <input id="taskName"
                    name="taskName"
                    type="text"
                    value={taskName}
                    onChange={event => setTaskName(event.target.value)}
                    placeholder="Input what you're working on" />

                <label htmlFor="startDate">Start: </label>
                <input id="startDate"
                    name="startDate"
                    type="date"
                    value={startDate}
                    max={endDate ? endDate : undefined}
                    onChange={event => setStartDate(event.target.value)} />
                <input id="startTime"
                    name="startTime"
                    type="time"
                    value={startTime}
                    onChange={event => setStartTime(event.target.value)} />

                <label htmlFor="endDate">End: </label>
                <input id="endDate"
                    name="endDate"
                    type="date"
                    value={endDate}
                    min={startDate ? startDate : undefined}
                    onChange={event => setEndDate(event.target.value)} />
                <input id="endTime"
                    name="endTime"
                    type="time"
                    value={endTime}
                    onChange={event => setEndTime(event.target.value)} />


                {/* Task project */}
                <div>
                    <DropdownSearch
                        defaultText={"Add a project"}
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

                <input
                    className="button"
                    type="submit"
                    value="Submit"
                    // Disable the submit button if the text field doesn't have any text
                    disabled={taskName.trim() === ""} />
            </form>
        </div>
    )
}

export default InputCustomInterval