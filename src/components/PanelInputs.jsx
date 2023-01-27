import React, { useState, useEffect } from "react"
import TimerControls from "./TimerControls"

// This next variables are used for debugging the timer
const TIMER_INCREMENT = 1
const TIMER_INTERVAL_MS = 25 // TODO: Reset to 1000 ms

const PanelInputs = ({ createNewTask }) => {
    // Holds the current amount of seconds the timer has counted
    const [seconds, setSeconds] = useState(0)
    // These functions belong to the new task form
    const [newTask, setNewTask] = useState("")
    // Keeps track of the state of the timer: it's running or it's stopped or it's zero
    const [timerStatus, setTimerStatus] = useState("reset");

    // Whenever the timer status is changed, it either creates an interval or clears it to keep track of the seconds
    useEffect(() => {
        console.log("Timer status: ", timerStatus)
        let timerSetInterval = null;
        if (timerStatus === "running") {
            timerSetInterval = setInterval(() => {
                setSeconds(prevTime => prevTime + TIMER_INCREMENT)
            }, TIMER_INTERVAL_MS);
        } else
            clearInterval(timerSetInterval)
        return () => clearInterval(timerSetInterval);
    }, [timerStatus])

    const handleSubmitNewTask = event => {
        event.preventDefault()
        // Submit the new task
        createNewTask(newTask, seconds)
        // Reset the form
        setNewTask("")
        resetTimer()
    }

    const resetTimer = () => { setTimerStatus("reset"); setSeconds(0) }

    return (
        <div>
            {/* Timer Display */}
            <p>Seconds elapsed: {seconds}</p>
            {/* New Task Input */}
            <form onSubmit={handleSubmitNewTask}>
                <input id="newTaskInput"
                    name="newTaskInput"
                    type="text"
                    value={newTask}
                    onChange={event => setNewTask(event.target.value)}
                    placeholder="Input your task" />
                <input id="submitNewTask"
                    name="submitNewTask"
                    type="submit"
                    value="Submit"
                    // Only allow submissions when the timer is stopped and there is text in the input field
                    disabled={!(timerStatus === "stopped") || (newTask === "")} />
            </form>
            <TimerControls
                timerStatus={timerStatus}
                startTimer={() => setTimerStatus("running")}
                stopTimer={() => setTimerStatus("stopped")}
                resetTimer={() => resetTimer()} />
        </div >
    );
}

export default PanelInputs