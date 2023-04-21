/** @namespace Component_InputTimer */
import { useState, useEffect, useRef } from "react"
import { CurrentTask, Project } from "../../types";
import { secondsToFormattedHMS } from "../../helpers/timeFormatting"
import DropdownSearch from "../Shared Components/DropdownSearch"
import Popover from "../Shared Components/Popover";
import usePopover from "../../hooks/usePopover";

/**
 * This variable refers to the amount of time the timer will wait to tick each time in milliseconds. In a production environment this value will be 1000[ms], or 1 second, but this can be varied so that it can be debugged more easily.
 * @type {Number}
 * @memberof Component_InputTimer
 */
const TIMER_INTERVAL_MS: number = 100; // TODO: Reset to 1000 ms

/**
 * This variable will set the limit for the text input in the component. After the limit is reached it will display a warning to the user.
 * @type {Number}
 * @memberof Component_InputTimer
 */
const MAX_NAME_LENGTH: number = 60;

type Props = {
    handleSubmit: Function,
    currentTask: null | CurrentTask,
    setCurrentTask: Function,
    projectsList: Project[],
    createProject: Function
}

/**
 * @param {Object} props - Component props object
 * @param {function(String,typedefs.Interval,Number|undefined):void} props.handleSubmit - Callback function that will be fired when the form is submitted
 * @param {null | typedefs.CurrentTask} props.currentTask - The current running Task state that represents the current task in the Timer. (The state initializes as null but it should change to CurrentTask after it's mounted)
 * @param {Function} props.setCurrentTask - Callback function that will set the state for the new current running task.
 * @param {Array<typedefs.Project>} props.projectsList - The list of existing projects. This is used in the Dropdown component that is used to select a project to assign the task to.
 * @param {function(String):Number} props.createProject - Callback function that will be fired when any of the input panels submits a new project (this is used inside of the Dropdown components)
 */
const InputTimer = ({ handleSubmit, currentTask, setCurrentTask, projectsList, createProject }: Props) => {
    /** Holds the amount of seconds the timer will display. */
    const [secondsToDisplay, setSecondsToDisplay] = useState(0);
    /** The name the new task will have. The corresponding input is controlled by this state. */
    const [taskName, setTaskName] = useState("");
    /** Keeps track of the state of the timer: it's running or it's stopped. */
    const [timerStatus, setTimerStatus] = useState("stopped"); // TODO Change this for a boolean value.
    /** Keeps track of the project selected through the Dropdown component. */
    const [taskProject, setTaskProject] = useState<number | null>(null);
    /** This variable is used to change the props given to the Dropdown component which triggers a hook to reset it's selection to none. */
    const [dropdownResetTrigger, setDropdownResetTrigger] = useState(0);
    /** This variable will hold the timestamp where the timer is started, giving the first half of the Interval the new task will have. The ending timestamp will be calculated when the timer is stopped. */
    let starterTimestamp = useRef(0);

    /** Whenever the currentTask given changes for a valid CurrentTask we will assign this to the form fields and activate the timer. */
    useEffect(() => {
        if (currentTask) {
            setTaskName(currentTask.name);
            starterTimestamp.current = currentTask.start;
            let initialSeconds = Math.floor((Date.now() - currentTask.start) / TIMER_INTERVAL_MS);
            setSecondsToDisplay(initialSeconds);
            if (currentTask.project)
                setTaskProject(currentTask.project)
            setTimerStatus("running");
        }
    }, [currentTask]);

    /** Whenever the timer status is changed, it either creates an interval when it starts or clears it when it stops. */
    useEffect(() => {
        let timerSetInterval: any = null; // Might be better off putting this in a useRef hook
        if (timerStatus === "running")
            timerSetInterval = setInterval(() =>
                setSecondsToDisplay(prevTime => prevTime + 1)
                , TIMER_INTERVAL_MS);
        else if (timerSetInterval)
            clearInterval(timerSetInterval); // Might be redundant code?
        return () => clearInterval(timerSetInterval);
    }, [timerStatus]);

    /** Not only update the controlled input in the form, but whenever the name changes also update the current running task in the global state */
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
        if (timerStatus === "running")
            setCurrentTask({ ...currentTask, name: newName });
    }

    /**  When the timer is started take the current Timestamp and whatever text is in the name field and create a CurrentTask that will be assigned to the global state, and start the timer so that it will start counting seconds from this moment. */
    const handleStartTimer = () => {
        starterTimestamp.current = Date.now();
        /** @type {typedefs.CurrentTask} */
        let newCurrentTask = { name: taskName, start: starterTimestamp.current };
        setCurrentTask(newCurrentTask);
        setTimerStatus("running");
    }

    /** When the timer is stopped not only it should stop counting seconds, but immediately validate and submit the form for the creation of a new task */
    const handleStopTimer = (event: any) => {
        event.preventDefault();
        if (timerStatus === "stopped") return;
        //      Validate the inputs
        if (taskName === "") {
            popoverErrorMessageButton.current = "Cannot stop the timer while the name of the task is empty!";
            openPopoverButton();
            return;
        }
        // This is the real amount of ms in between the timer being started and stopped
        let duration = Date.now() - starterTimestamp.current;
        // However, given that we can modify the speed of the timer for testing purpouses we will take that into account and adjust the timestamps for this duration. In a normal setting where each tick is 1000ms this adjustment would be 1.0
        let adjustment = (1000 / TIMER_INTERVAL_MS);
        let endTimestamp = starterTimestamp.current + duration * adjustment;
        //      Stop the timer
        setTimerStatus("stopped");
        //      Submit the new task
        handleSubmit(taskName, { start: starterTimestamp.current, end: endTimestamp }, taskProject || undefined);
        //      Reset the form
        setTaskName("");
        setTaskProject(null);
        setDropdownResetTrigger(dropdownResetTrigger + 1); // Trigger a useEffect hook in the child component to change state
        setSecondsToDisplay(0);
        //      Change the state of the variable in the App component too
        setCurrentTask(null);
    }

    /**
     * This function is used when a project is created in the Dropdown component.
     * @param {String} newProjectName - The name for the new project.
     * @returns {Number} - The id of the newly created project
     */
    const handleProjectCreation = (newProjectName: string) => {
        let newProjectID = createProject(newProjectName);
        setTaskProject(newProjectID);
        return newProjectID;
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
            <form onSubmit={handleStopTimer}>
                <div className="input-task-info">
                    {/* Task Name Input */}
                    <input id="newTaskInput"
                        name="newTaskInput"
                        className="round-box"
                        type="text"
                        value={taskName}
                        onChange={handleNameChange}
                        placeholder="Input what you're working on"
                        // @ts-ignore
                        ref={setRefFocusElementInput}
                    />
                    {/* Task project Dropdown */}
                    <DropdownSearch
                        defaultText={"Assign a project"}
                        searchPlaceholder={"Search a project or create a new one"}
                        optionsList={
                            projectsList.map(project => {
                                return { id: project.id, value: project.name }
                            })}
                        initialSelection={taskProject}
                        onCreateCallback={handleProjectCreation}
                        onSelectCallback={setTaskProject}
                        resetTrigger={dropdownResetTrigger}
                    />
                </div>
                {/* Timer Display */}
                <p className="input-timer-counter">
                    Time elapsed: {secondsToFormattedHMS(secondsToDisplay)}s
                </p>
                {/* The Start/Stop button of the timer */}
                <div className="button-submit-task-container">
                    {timerStatus === "stopped" &&
                        <button
                            className="button button-submit-task button button-primary"
                            onClick={handleStartTimer}
                        >
                            Start
                        </button>}
                    {timerStatus === "running" &&
                        <input id="submitNewTask"
                            name="submitNewTask"
                            className="button button-submit-task button button-danger"
                            type="submit"
                            value="Stop"
                            // @ts-ignore
                            ref={setRefFocusElementButton}
                        />}
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

export default InputTimer;