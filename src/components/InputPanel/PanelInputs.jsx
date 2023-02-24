import React, { useState } from "react"
import PanelInputTimer from "./PanelInputTimer"
import PanelInputInterval from "./PanelInputInterval"
// Material Icons
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import ViewDayOutlinedIcon from '@mui/icons-material/ViewDayOutlined';
// eslint-disable-next-line no-unused-vars
const typedefs = require("./../types"); // JSDoc Type Definitions

/**
 * This component handles the conditional rendering of which of the input methods is presented to the user.
 * For the time being the only two methods are: A timer that starts and ends and it's controlled by the user, which means the task will be set for the duration the timer was active, and a custom interval form that the user can use to input any arbitrary interval of time.
 * @param {Object} props - Component props object
 * @param {Function} props.createNewTask - Callback function that will be fired when any of the input panels submits a new task
 * @param {null | typedefs.CurrentTask} props.currentTask - The current running Task state that represents the current task in the Timer. (The state initializes as null but it should change to CurrentTask after it's mounted)
 * @param {Function} props.setCurrentTask - Callback function that will set the state for the new current running task, set in the Timer.
 * @param {Array} props.projectsList - The list of existing projects. This is used in the Dropdown component that is used to select a project to assign the task to.
 * @param {function(String):Number} props.createProject - Callback function that will be fired when any of the input panels submits a new project (this is used inside of the Dropdown components)
 */
const PanelInputs = ({ createNewTask, currentTask, setCurrentTask, projectsList, createProject }) => {

    /** This variable controls the conditional rendering of which input method is currently being displayed, either 'timer' or 'custom' */
    const [inputMethod, setInputMethod] = useState("timer");

    /**
     * This function will be sent down to the different input methods components as a callback to handle the data used in the creation of a new Task. After receiving and validating the data this will elevate it through the createNewTask callback and the App component will append the new Task to the state.
     * @param {String} taskName - The name of the new task.
     * @param {typedefs.Interval} interval - The interval which contains the start and end points of the task.
     * @param {Number} [projectId=undefined] - The id number for the project the task is assigned to. If no project was selected then this field will be undefined.
     */
    const handleNewTaskSubmitted = (taskName, interval, projectId = undefined) => {
        // TODO - fields validation
        createNewTask(taskName, interval, projectId);
    }

    return (
        <section className="panel-input">
            <form
                name="inputTypeSelector"
                className="input-control-bar"
                /* @ts-ignore. The linter gives error for the event.target.value */
                onChange={event => setInputMethod(event.target.value)}
            >
                <input
                    type="radio"
                    id="inputSelectorTimer"
                    name="inputSelector"
                    className="input-selector-radio"
                    value="timer"
                    defaultChecked
                />
                <label
                    htmlFor="inputSelectorTimer"
                    className="button input-selector-label"
                    selected-method={inputMethod === "timer" ? 1 : 0}
                >
                    <span className="mui-icon"><TimerOutlinedIcon /></span>
                    <span>Timer</span>
                </label>
                <input
                    type="radio"
                    id="inputSelectorInterval"
                    name="inputSelector"
                    className="input-selector-radio"
                    value="interval"
                />
                <label
                    htmlFor="inputSelectorInterval"
                    className="button input-selector-label"
                    selected-method={inputMethod === "interval" ? 1 : 0}
                >
                    <span className="mui-icon"><ViewDayOutlinedIcon /></span>
                    <span>Custom interval</span>
                </label>
            </form>
            {
                inputMethod === "timer" ?
                    <PanelInputTimer
                        handleSubmit={handleNewTaskSubmitted}
                        currentTask={currentTask}
                        setCurrentTask={setCurrentTask}
                        projectsList={projectsList}
                        createProject={createProject}
                    />
                    :
                    <PanelInputInterval
                        handleSubmit={handleNewTaskSubmitted}
                        projectsList={projectsList}
                        createProject={createProject}
                    />
            }
        </section>
    )
}
export default PanelInputs