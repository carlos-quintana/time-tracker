/** @namespace Component_InputTimer */
import React, { useState, useEffect, useRef } from "react"
import { secondsToFormattedHMS } from "../../helpers/timeFormatting"
import DropdownSearch from "../Shared Components/DropdownSearch"
// eslint-disable-next-line no-unused-vars
const typedefs = require("./../types"); // JSDoc Type Definitions

/**
 * This variable refers to the amount of time the timer will wait to tick each time in milliseconds. In a production environment this value will be 1000[ms], or 1 second, but this can be varied so that it can be debugged more easily.
 * @type {Number}
 * @memberof Component_InputTimer
 */
const TIMER_INTERVAL_MS = 50; // TODO: Reset to 1000 ms

/**
 * @param {Object} props - Component props object
 * @param {function(String,typedefs.Interval,Number|undefined):void} props.handleSubmit - Callback function that will be fired when the form is submitted
 * @param {null | typedefs.CurrentTask} props.currentTask - The current running Task state that represents the current task in the Timer. (The state initializes as null but it should change to CurrentTask after it's mounted)
 * @param {Function} props.setCurrentTask - Callback function that will set the state for the new current running task.
 * @param {Array<typedefs.Project>} props.projectsList - The list of existing projects. This is used in the Dropdown component that is used to select a project to assign the task to.
 * @param {function(String):Number} props.createProject - Callback function that will be fired when any of the input panels submits a new project (this is used inside of the Dropdown components)
 */
const InputTimer = ({ handleSubmit, currentTask, setCurrentTask, projectsList, createProject }) => {
    /** Holds the amount of seconds the timer will display. */
    const [secondsToDisplay, setSecondsToDisplay] = useState(0);
    /** The name the new task will have. The corresponding input is controlled by this state. */
    const [taskName, setTaskName] = useState("");
    /** Keeps track of the state of the timer: it's running or it's stopped. */
    const [timerStatus, setTimerStatus] = useState("stopped"); // TODO Change this for a boolean value.
    /** Keeps track of the project selected through the Dropdown component. */
    const [taskProject, setTaskProject] = useState(/**@type {null | Number}*/(null));
    /** This variable is used to change the props given to the Dropdown component which triggers a hook to reset it's selection to none. */
    const [dropdownResetTrigger, setDropdownResetTrigger] = useState(0);
    /** This variable will hold the timestamp where the timer is started, giving the first half of the Interval the new task will have. The ending timestamp will be calculated when the timer is stopped. */
    let starterTimestamp = useRef(0);

    /** Whenever the currentTask given changes for a valid CurrentTask we will assign this to the form fields and activate the timer. */
    useEffect(() => {
        // console.log("> (InputTimer) Entering the currentTask useEffect")
        // console.log({ currentTask })
        if (currentTask) {
            // console.log("There is a task currently running so it will be assigned to the values of the form")
            setTaskName(currentTask.name);
            // console.log(`Assignned the name ${currentTask.name}`)
            starterTimestamp.current = currentTask.start;
            // console.log(`Assignned the starterTimestamp ${currentTask.start}`)
            let initialSeconds = Math.floor((Date.now() - currentTask.start) / TIMER_INTERVAL_MS);
            setSecondsToDisplay(initialSeconds);
            // console.log(`Assignned the initial seconds value to ${initialSeconds} `)
            setTimerStatus("running");
        }
        // console.log("< (InputTimer) Exiting the currentTask useEffect")
    }, [currentTask]);

    /** Whenever the timer status is changed, it either creates an interval when it starts or clears it when it stops. */
    useEffect(() => {
        // console.log("> (InputTimer) Entering the timerStatus useEffect")
        // console.log("Timer status: ", timerStatus)
        let timerSetInterval = null; // Might be better off putting this in a useRef hook
        if (timerStatus === "running")
            timerSetInterval = setInterval(() =>
                setSecondsToDisplay(prevTime => prevTime + 1)
                , TIMER_INTERVAL_MS);
        else if (timerSetInterval)
            clearInterval(timerSetInterval); // Might be redundant code?
        // console.log("< (InputTimer) exiting the timerStatus useEffect")
        return () => clearInterval(timerSetInterval);
    }, [timerStatus]);

    /** Not only update the controlled input in the form, but whenever the name changes also update the current running task in the global state */
    const handleNameChange = event => {
        // console.log("> (InputTimer) Entering handleNameChange")
        // console.log(event.target.value)
        setTaskName(event.target.value);
        if (timerStatus === "running")
            setCurrentTask({ ...currentTask, name: event.target.value });
        // console.log("< (InputTimer) Exiting handleNameChange")
    }

    /**  When the timer is started take the current Timestamp and whatever text is in the name field and create a CurrentTask that will be assigned to the global state, and start the timer so that it will start counting seconds from this moment. */
    const handleStartTimer = () => {
        // console.log("> (InputTimer) Entering handleStartTimer")
        starterTimestamp.current = Date.now();
        /** @type {typedefs.CurrentTask} */
        let newCurrentTask = { name: taskName, start: starterTimestamp.current };
        setCurrentTask(newCurrentTask);
        setTimerStatus("running");
        // console.log(`The timer is running now, the starterTimestamp will be ${starterTimestamp.current} `)
        // console.log("< (InputTimer) Exiting handleStartTimer")
    }

    /** When the timer is stopped not only it should stop counting seconds, but immediately validate and submit the form for the creation of a new task */
    const handleStopTimer = event => {
        //      TODO: Validate task fields
        // console.log("> (InputTimer) Entering handleStopTimer")
        event.preventDefault();
        //      Stop the timer
        setTimerStatus("stopped");
        // console.log("Stopped the timer")
        // This is the real amount of ms in between the timer being started and stopped
        let duration = Date.now() - starterTimestamp.current;
        // However, given that we can modify the speed of the timer for testing purpouses we will take that into account and adjust the timestamps for this duration. In a normal setting where each tick is 1000ms this adjustment would be 1.0
        let adjustment = (1000 / TIMER_INTERVAL_MS);
        let endTimestamp = starterTimestamp.current + duration * adjustment;
        //      Submit the new task
        // console.log(`The value of starterTimestamp is ${starterTimestamp.current} `)
        // console.log(`The value of the ending timestamp is ${endTimestamp} `)
        // console.log(`For a duration value of  ${duration} `)
        handleSubmit(taskName, { start: starterTimestamp.current, end: endTimestamp }, taskProject || undefined);
        //      Reset the form
        setTaskName(""); // The input for the name of the new task
        setTaskProject(null); // The state in the panel for which project is selected
        setDropdownResetTrigger(dropdownResetTrigger + 1); // Trigger a useEffect hook in the child component to change state
        setSecondsToDisplay(0);
        //      Change the state of the variable in the App component too
        setCurrentTask(null);
        // console.log("< (InputTimer) Exiting handleStopTimer")
    }

    /**
     * This function is used when a project is created in the Dropdown component.
     * @param {String} newProjectName - The name for the new project.
     * @returns {Number} - The id of the newly created project
     */
    const handleProjectCreation = newProjectName => {
        let newProjectID = createProject(newProjectName);
        return newProjectID;
    }

    return (
        <div>
            {/* Timer Display */}
            <p>Time elapsed: {secondsToFormattedHMS(secondsToDisplay)}s</p>
            <form onSubmit={handleStopTimer}>
                {/* Task Name Input */}
                <input id="newTaskInput"
                    name="newTaskInput"
                    type="text"
                    value={taskName}
                    onChange={handleNameChange}
                    placeholder="Input what you're working on"
                />
                {/* Task project Dropdown */}
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
                {/* The Start/Stop button of the timer */}
                <div>
                    {timerStatus === "stopped" &&
                        <button onClick={handleStartTimer}
                            // Only allow the timer to start when there is text in the input field
                            disabled={taskName.trim() === ""}>
                            Start
                        </button>}
                    {timerStatus === "running" &&
                        <input id="submitNewTask"
                            name="submitNewTask"
                            type="submit"
                            value="Stop"
                            // Only allow submissions when there is text in the input field
                            disabled={taskName.trim() === ""} />}
                </div>
            </form>
        </div>
    )
}

export default InputTimer;