import React, { useState, useEffect, useRef } from "react"
import { secondsToFormattedHMS } from "../helpers/timeConversion"

// This next variables are used for debugging the timer
const TIMER_INCREMENT = 1
const TIMER_INTERVAL_MS = 10 // TODO: Reset to 1000 ms

const InputTimer = ({ handleSubmit }) => {
    // Holds the current amount of seconds the timer will display
    const [seconds, setSeconds] = useState(0)
    // These functions belong to the new entry form
    const [newEntry, setNewEntry] = useState("")
    // Keeps track of the state of the timer: it's running or it's stopped 
    const [timerStatus, setTimerStatus] = useState("stopped");

    let starterTimestamp = useRef(0);

    // Whenever the timer status is changed, it either creates an interval or clears it to keep track of the seconds
    useEffect(() => {
        console.log("Timer status: ", timerStatus)
        let timerSetInterval = null;
        if (timerStatus === "running") {
            starterTimestamp.current = Date.now();
            console.log(`The timer is running now, the starterTimestamp will be ${starterTimestamp.current}`)
            timerSetInterval = setInterval(() => {
                setSeconds(prevTime => prevTime + TIMER_INCREMENT)
            }, TIMER_INTERVAL_MS);
        } else
            clearInterval(timerSetInterval)
        return () => clearInterval(timerSetInterval);
    }, [timerStatus])

    const handleStopTimer = event => {
        event.preventDefault();
        // Stop the timer
        setTimerStatus("stopped")
        console.log("Stopped the timer")

        // This is the real amount of ms in between the timer being started and stopped
        let rawDuration = Date.now() - starterTimestamp.current
        // However, given that we can modify the speed of the timer for testing purpouses we will take that
        // into account and adjust the timestamps for this duration. In a normal setting this adjustment would be 1.0
        let endTimestamp = starterTimestamp.current + (rawDuration * TIMER_INCREMENT * (1000 / TIMER_INTERVAL_MS))
        // Submit the new entry
        console.log(`The value of starterTimestamp is ${starterTimestamp.current}`)
        console.log(`The value of the ending timestamp is ${endTimestamp}`)
        console.log(`For a duration value of  ${rawDuration}`)
        handleSubmit(newEntry, { start: starterTimestamp.current, end: endTimestamp })
        // Reset the form
        setNewEntry("")
        setSeconds(0)
    }

    return (
        <div>
            {/* Timer Display */}
            <p>Time elapsed: {secondsToFormattedHMS(seconds)}s</p>
            {/* New Entry Input */}
            <form onSubmit={handleStopTimer}>
                <input id="newEntryInput"
                    name="newEntryInput"
                    type="text"
                    value={newEntry}
                    onChange={event => setNewEntry(event.target.value)}
                    placeholder="Input what you're working on" />
                <div>
                    {timerStatus === "stopped" &&
                        <button onClick={() => setTimerStatus("running")}
                            // Only allow the timer to start when there is text in the input field
                            disabled={newEntry.trim() === ""}>
                            Start
                        </button>}
                    {timerStatus === "running" &&
                        <input id="submitNewEntry"
                            name="submitNewEntry"
                            type="submit"
                            value="Stop"
                            // Only allow submissions when the timer is stopped and there is text in the input field
                            disabled={newEntry.trim() === ""} />}
                </div>
            </form>
        </div>
    )
}

export default InputTimer;