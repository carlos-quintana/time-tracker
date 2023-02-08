import React, { useState } from "react"
import { timestampToHMS, HMSToTimestamp, timestampToTimeToDisplay } from "../helpers/timeFormatting"

const DisplayEntryTime = ({ id, interval: { start, end }, handleIntervalUpdate, intervalPosition }) => {

    // The component will hold the date in the state in the form of a UNIX timestamp
    const [tempTimestamp, setTempTimestamp] = useState(intervalPosition === "start" ? start : end)
    const [isEditingTime, setIsEditingTime] = useState(false)

    const handleInputChange = event => {
        let formattedTime = HMSToTimestamp(event.target.value, tempTimestamp)
        setTempTimestamp(formattedTime)
    }

    const handleSubmit = event => {
        event.preventDefault();
        console.log(`An edit for the ${intervalPosition === "start" ? "start" : "end"} time field has been submitted for the entry ${id}`)
        console.log({ tempTime: tempTimestamp })
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
        // Edit Entry
        console.log("About to fire the handleIntervalUpdate")
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
                            id={`${id}-editEntry${intervalPosition === "start" ? "Start" : "End"}Time`}
                            name={`editEntry${intervalPosition === "start" ? "Start" : "End"}Time`}
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
                    <span>
                        {timestampToTimeToDisplay(tempTimestamp)}
                    </span>
            }
            <button
                onClick={() => setIsEditingTime(true)}
                disabled={isEditingTime}
            >
                Editar time
            </button>
        </>
    )
}

export default DisplayEntryTime;