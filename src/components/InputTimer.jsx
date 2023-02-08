import React, { useState, useEffect, useRef } from "react"
import { secondsToFormattedHMS } from "../helpers/timeFormatting"

// This next variables are used for debugging the timer
const TIMER_INCREMENT = 1
const TIMER_INTERVAL_MS = 50 // TODO: Reset to 1000 ms

const InputTimer = ({ handleSubmit, currentRunningTask, setCurrentRunningTask }) => {
    // Holds the current amount of seconds the timer will display
    const [secondsToDisplay, setSecondsToDisplay] = useState(0)
    // These functions belong to the new task form
    const [formNewTaskName, setFormNewTaskName] = useState("")
    // Keeps track of the state of the timer: it's running or it's stopped 
    const [timerStatus, setTimerStatus] = useState("stopped");

    let starterTimestamp = useRef(0);

    useEffect(() => {
        // console.log("> (InputTimer) Entering the currentRunningTask useEffect")
        // console.log({ currentRunningTask })
        if (currentRunningTask) {
            // console.log("There is a task currently running so it will be assigned to the values of the form")
            setFormNewTaskName(currentRunningTask.name)
            // console.log(`Assignned the name ${currentRunningTask.name}`)
            starterTimestamp.current = currentRunningTask.starterTimestamp
            // console.log(`Assignned the starterTimestamp ${currentRunningTask.starterTimestamp}`)
            let initialSeconds = Math.floor((Date.now() - currentRunningTask.starterTimestamp) / 1000 * (1000 / TIMER_INTERVAL_MS))
            setSecondsToDisplay(initialSeconds)
            // console.log(`Assignned the initial seconds value to ${initialSeconds} `)
            setTimerStatus("running")
        }
        // console.log("< (InputTimer) Exiting the currentRunningTask useEffect")
    }, [currentRunningTask])

    // Whenever the timer status is changed, it either creates an interval or clears it to keep track of the seconds
    useEffect(() => {
        // console.log("> (InputTimer) Entering the timerStatus useEffect")
        // console.log("Timer status: ", timerStatus)
        let timerSetInterval = null;
        if (timerStatus === "running") {
            timerSetInterval = setInterval(() => {
                setSecondsToDisplay(prevTime => prevTime + TIMER_INCREMENT)
            }, TIMER_INTERVAL_MS);
        } else
            clearInterval(timerSetInterval)
        // console.log("< (InputTimer) exitingthe timerStatus useEffect")
        return () => clearInterval(timerSetInterval);
    }, [timerStatus])

    const handleNameChange = event => {
        // console.log("> (InputTimer) Entering handleNameChange")
        // console.log(event.target.value)
        setFormNewTaskName(event.target.value)
        if (timerStatus === "running") 
            setCurrentRunningTask({ ...currentRunningTask, name: event.target.value })
        // console.log("< (InputTimer) Exiting handleNameChange")
    }

    const handleStartTimer = () => {
        // console.log("> (InputTimer) Entering handleStartTimer")
        starterTimestamp.current = Date.now();
        setCurrentRunningTask({ name: formNewTaskName, starterTimestamp: starterTimestamp.current })
        setTimerStatus("running")
        // console.log(`The timer is running now, the starterTimestamp will be ${starterTimestamp.current} `)
        // console.log("< (InputTimer) Exiting handleStartTimer")
    }

    const handleStopTimer = event => {
        // console.log("> (InputTimer) Entering handleStopTimer")
        event.preventDefault();
        // Stop the timer
        setTimerStatus("stopped")
        // console.log("Stopped the timer")

        // This is the real amount of ms in between the timer being started and stopped
        let rawDuration = Date.now() - starterTimestamp.current
        // However, given that we can modify the speed of the timer for testing purpouses we will take that
        // into account and adjust the timestamps for this duration. In a normal setting this adjustment would be 1.0
        let endTimestamp = starterTimestamp.current + (rawDuration * TIMER_INCREMENT * (1000 / TIMER_INTERVAL_MS))
        // Submit the new task
        // console.log(`The value of starterTimestamp is ${starterTimestamp.current} `)
        // console.log(`The value of the ending timestamp is ${endTimestamp} `)
        // console.log(`For a duration value of  ${rawDuration} `)
        handleSubmit(formNewTaskName, { start: starterTimestamp.current, end: endTimestamp })
        // Reset the form
        setFormNewTaskName("")
        setSecondsToDisplay(0)
        // Change the state of the variable in the App component too
        setCurrentRunningTask(null)
        // console.log("< (InputTimer) Exiting handleStopTimer")
    }

    return (
        <div>
            {/* Timer Display */}
            <p>Time elapsed: {secondsToFormattedHMS(secondsToDisplay)}s</p>
            {/* New Task Input */}
            <form onSubmit={handleStopTimer}>
                <input id="newTaskInput"
                    name="newTaskInput"
                    type="text"
                    value={formNewTaskName}
                    onChange={handleNameChange}
                    placeholder="Input what you're working on" />
                <div>
                    {timerStatus === "stopped" &&
                        <button onClick={handleStartTimer}
                            // Only allow the timer to start when there is text in the input field
                            disabled={formNewTaskName.trim() === ""}>
                            Start
                        </button>}
                    {timerStatus === "running" &&
                        <input id="submitNewTask"
                            name="submitNewTask"
                            type="submit"
                            value="Stop"
                            // Only allow submissions when the timer is stopped and there is text in the input field
                            disabled={formNewTaskName.trim() === ""} />}
                </div>
            </form>
        </div>
    )
}

export default InputTimer;