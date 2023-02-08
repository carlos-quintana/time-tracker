import React, { useState, useEffect } from "react"
import { timestampToHMS, HMSToTimestamp, timestampToTimeToDisplay } from "../helpers/timeFormatting"

const DisplayTaskTime = ({ id, interval: { start, end }, handleIntervalUpdate, intervalPosition }) => {

    // The component will hold the date in the state in the form of a UNIX timestamp
    const [tempTimestamp, setTempTimestamp] = useState(intervalPosition === "start" ? start : end)
    const [isEditingTime, setIsEditingTime] = useState(false)

    useEffect(() => setTempTimestamp(intervalPosition === "start" ? start : end), [start, end, intervalPosition])

    const handleInputChange = event => {
        // console.log(`~An edit for the ${intervalPosition === "start" ? "start" : "end"} time field has been made for the task ${id}`)
        // console.log({ previousValue: tempTimestamp })
        // console.log({ previousValue: new Date(tempTimestamp) })
        // console.log({ newValue: event.target.value })
        // console.log({ newValue: new Date(event.target.value) })
        let formattedTime = HMSToTimestamp(event.target.value, tempTimestamp)
        setTempTimestamp(formattedTime)
    }

    const handleSubmit = event => {
        event.preventDefault();
        // console.log(`An edit for the ${intervalPosition === "start" ? "start" : "end"} time field has been submitted for the task ${id}`)
        // console.log({ start, end })
        // console.log({ start: new Date(start), end: new Date(end) })
        // console.log({ tempTimestamp })
        // Form validations
        if (intervalPosition === "start" && tempTimestamp > end) {
            alert("The starting time cannot be after the end time")
            setTempTimestamp(intervalPosition === "start" ? start : end)
            setIsEditingTime(false)
            return
        }
        if (intervalPosition === "end" && tempTimestamp < start) {
            alert("The ending time cannot be before the starting time")
            setTempTimestamp(intervalPosition === "start" ? start : end)
            setIsEditingTime(false)
            return
        }
        // Edit Task
        // console.log("About to fire the handleIntervalUpdate")
        if (intervalPosition === "start")
            handleIntervalUpdate({ start: tempTimestamp, end })
        else
            handleIntervalUpdate({ start, end: tempTimestamp })
        // Cleanup
        setIsEditingTime(false)
    }

    return (
        <>
            {
                isEditingTime ?
                    <form onSubmit={event => handleSubmit(event)}>
                        <input
                            id={`${id}-editTask${intervalPosition === "start" ? "Start" : "End"}Time`}
                            name={`editTask${intervalPosition === "start" ? "Start" : "End"}Time`}
                            type="time"
                            value={timestampToHMS(tempTimestamp)}
                            onChange={handleInputChange}
                            step="1"
                            // min={intervalPosition === "start" ? undefined : TODO}
                            // max={intervalPosition === "end" ? undefined : TODO}
                            autoFocus
                            onBlur={event => handleSubmit(event)}
                        />
                    </form>
                    :
                    <button
                        onClick={() => setIsEditingTime(true)}
                    >
                        <span>
                            {timestampToTimeToDisplay(tempTimestamp)}
                        </span>
                    </button>
            }
            {/* <button
                onClick={() => setIsEditingTime(true)}
                disabled={isEditingTime}
            >
                Editar time
            </button> */}
        </>
    )
}

export default DisplayTaskTime;