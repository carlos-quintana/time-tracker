/** @namespace Component_InputInterval */
import { useRef, useState } from "react"
import { Project } from "../../types";
import DropdownSearch from "../Shared Components/DropdownSearch"
import usePopover from "../../hooks/usePopover";
import Popover from "../Shared Components/Popover";

/**
 * This variable will set the limit for the text input in the component. After the limit is reached it will display a warning to the user.
 * @type {Number}
 * @memberof Component_InputInterval
 */
const MAX_NAME_LENGTH: number = 60;

type Props = {
    handleSubmit: Function,
    projectsList: Project[],
    createProject: Function
}
/**
 * @param {Object} props - Component props object
 * @param {function(String,Interval,Number|undefined):void} props.handleSubmit - Callback function that will be fired when the form is submitted
 * @param {Array<Project>} props.projectsList - The list of existing projects. This is used in the dropdown component that is used to select a project to assign the task to.
 * @param {function(String):Number} props.createProject - Callback function that will be fired when any of the input panels submits a new project (this is used inside of the Dropdown components)
 */
const InputCustomInterval = ({ handleSubmit: handleEntrySubmit, projectsList, createProject }: Props) => {

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

    const handleNameChange = (event: any) => {
        // This line will take the input given by the user and remove any trailing white spaces. There is the special condition where the user uses one single space at the end to separate words though.
        let newName = event.target.value.slice(-1) === " " ?
            event.target.value.trim() + " " :
            event.target.value.trim();
        // Check the length of the name is valid. If the user exceeds this limit stop adding characters to the input and fire the notification
        if (newName.length > MAX_NAME_LENGTH) {
            // Because we don't want to close the input this time we open the popover manually
            popoverErrorMessageInput.current = "The name you're trying to input is too long";
            openPopoverInput();
            setTaskName(newName.slice(0, MAX_NAME_LENGTH));
            return;
        }
        if (popoverPropsInput.isOpenPopover && newName.length < MAX_NAME_LENGTH)
            closePopoverInput()
        setTaskName(newName);
    }

    /** When the form is submitted validate the data for the new task and then elevate this with the callback to submit the new task. */
    const handleFormSubmit = (event: any) => {
        event.preventDefault();
        //      Validation
        //      Validate empty fields
        if (taskName.trim() === "") {
            abortSubmit("The name of the task cannot be empty"); return;
        }
        if (!(startDate && startTime && endDate && endTime)) {
            abortSubmit("Please fill in all of the fields"); return;
        }
        //      Validate start datetime is before end datetime
        let startTimestamp = new Date(startDate + " " + startTime).getTime();
        let endTimestamp = new Date(endDate + " " + endTime).getTime();
        if (startTimestamp >= endTimestamp) {
            abortSubmit("The times selected are not valid"); return;
        }
        //      Callback to submit task
        handleEntrySubmit(taskName, { start: startTimestamp, end: endTimestamp }, taskProject || undefined);
        resetForm()
    }

    const resetForm = () => {
        setTaskName("");
        setStartDate("");
        setEndDate("");
        setStartTime("");
        setEndTime("");
        setTaskProject(null); // The state in the panel for which project is selected
        setDropdownResetTrigger(dropdownResetTrigger + 1); // Trigger a useEffect hook in the child component to change the selected state to none. We're on the lookout for a better method to do this.
    }

    /**
     * This function is used when a project is created in the Dropdown component.
     * @param {String} newProjectName - The name for the new project.
     * @returns {Number} - The id of the newly created project
     */
    const handleProjectCreation = (newProjectName: string): number => {
        let newProjectID = createProject(newProjectName);
        setTaskProject(newProjectID);
        return newProjectID;
    }

    /**
     * This component has enough different validations and escape conditions that it warrants having a separate function for handling the errors.
     * @param {string} message - The message to display in the alert
     */
    const abortSubmit = (message: string) => {
        popoverErrorMessageButton.current = message;
        openPopoverButton();
    }

    /** This is for the error popover that appears over the input when validation fails (like when the input is too long) */
    const { openPopover: openPopoverInput,
        closePopover: closePopoverInput,
        setRefFocusElement: setRefFocusElementInput,
        popoverProps: popoverPropsInput } = usePopover(true);
    let popoverErrorMessageInput = useRef("");
    /** This is for the error popover that appears over the button when validation fails (like when the name is empty) */
    const { openPopover: openPopoverButton,
        closePopover: closePopoverButton,
        setRefFocusElement: setRefFocusElementButton,
        popoverProps: popoverPropsButton } = usePopover(true);
    let popoverErrorMessageButton = useRef("");

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
                        ref={setRefFocusElementInput}
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
                <div className="input-intervals-container">
                    <label htmlFor="startDate">Start: </label>
                    <input
                        id="startDate"
                        name="startDate"
                        className="editable"
                        type="date"
                        value={startDate}
                        max={endDate ? endDate : undefined}
                        onChange={event => setStartDate(event.target.value)}
                    />
                    <input id="startTime"
                        name="startTime"
                        type="time"
                        value={startTime}
                        onChange={event => setStartTime(event.target.value)}
                    />
                    <label htmlFor="endDate">End: </label>
                    <input id="endDate"
                        name="endDate"
                        type="date"
                        value={endDate}
                        min={startDate ? startDate : undefined}
                        onChange={event => setEndDate(event.target.value)}
                    />
                    <input id="endTime"
                        name="endTime"
                        type="time"
                        value={endTime}
                        onChange={event => setEndTime(event.target.value)}
                    />
                </div>
                <div className="button-submit-task-container">
                    <input
                        className="button button-submit-task button button-primary"
                        type="submit"
                        value="Submit"
                        ref={setRefFocusElementButton} />
                </div>
            </form>
            <Popover {...popoverPropsInput}>
                <h1 className="popover__title popover__title--danger">Error</h1>
                <p className="popover__text">{popoverErrorMessageInput.current}</p>
            </Popover >
            <Popover {...popoverPropsButton}>
                <h1 className="popover__title popover__title--danger">Error</h1>
                <p className="popover__text">{popoverErrorMessageButton.current}</p>
                <button className="button" onClick={closePopoverButton}>Okay</button>
            </Popover >
        </div>
    )
}

export default InputCustomInterval