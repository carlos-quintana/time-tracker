import React, { useState, useEffect, useRef } from "react"
import { secondsToFormattedHMS } from "../helpers/timeConversion"

// This next variables are used for debugging the timer
import InputTimer from "./InputTimer"
const TIMER_INTERVAL_MS = 25 // TODO: Reset to 1000 ms

const PanelInputs = ({ createNewEntry }) => {
    // Holds the current amount of seconds the timer will display
    const [seconds, setSeconds] = useState(0)
    // These functions belong to the new entry form
    const [newEntry, setNewEntry] = useState("")
    // Keeps track of the state of the timer: it's running or it's stopped 
    const [timerStatus, setTimerStatus] = useState("stopped");

    let starterTimestamp = useRef(0);

    const handleNewEntrySubmitted = (entryName, interval) => {
        // TODO
        createNewEntry(entryName, interval)
    }

    return (
        <div>
                    <InputTimer
                        handleSubmit={handleNewEntrySubmitted}
                    />
        </div>
    )
}
export default PanelInputs