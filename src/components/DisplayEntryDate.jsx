import React, { useState } from "react"
import { timestampToDateSnake, dateSnakeToTimestamp, timestampToDateToDisplay } from "../helpers/timeFormatting"

const DisplayEntryDate = ({ id, interval: { start, end }, handleIntervalUpdate, intervalPosition }) => {

    // The component will hold the date in the state in the form of a UNIX timestamp
    const [tempTimestamp, setTempTimestamp] = useState(intervalPosition === "start" ? start : end)
    const [isEditingDate, setIsEditingDate] = useState(false)

    const handleInputChange = event => {
        let formattedDate = dateSnakeToTimestamp(event.target.value, tempTimestamp)
        setTempTimestamp(formattedDate)
    }

    const handleSubmit = event => {
        event.preventDefault()
        console.log(`An edit for the ${intervalPosition === "start" ? "start" : "end"} date field has been submitted for the entry ${id}`)
        console.log({ tempDate: tempTimestamp })
        // Form validations
        if (tempTimestamp < 0) {
            alert("The date is not valid")
            return
        }
        if (intervalPosition === "start" && tempTimestamp > end) {
            alert("The starting date cannot be after the end date")
            setTempTimestamp(intervalPosition === "start" ? start : end)
            setIsEditingDate(false)
            return
        }
        if (intervalPosition === "end" && tempTimestamp < start) {
            alert("The ending date cannot be before the starting date")
            setTempTimestamp(intervalPosition === "start" ? start : end)
            setIsEditingDate(false)
            return
        }

        // Edit Entry
        console.log("About to fire the handleIntervalUpdate")
        if (intervalPosition === "start")
            handleIntervalUpdate({ start: tempTimestamp, end })
        else
            handleIntervalUpdate({ start, end: tempTimestamp })
        // Cleanup
        setIsEditingDate(false)
    }

    return (
        <>
            {
                isEditingDate ?
                    <form onSubmit={event => handleSubmit(event)}>
                        <input
                            id={`${id}-editEntry${intervalPosition === "start" ? "Start" : "End"}Date`}
                            name={`editEntry${intervalPosition === "start" ? "Start" : "End"}Date`}
                            type="date"
                            value={timestampToDateSnake(tempTimestamp)}
                            onChange={handleInputChange}
                            min={intervalPosition === "start" ? undefined : timestampToDateSnake(start)}
                            max={intervalPosition === "end" ? undefined : timestampToDateSnake(end)}
                            autoFocus
                            onBlur={event => handleSubmit(event)}
                        />
                    </form>
                    :
                    <span>
                        {timestampToDateToDisplay(tempTimestamp)}
                    </span>
            }
            <button
                onClick={() => setIsEditingDate(true)}
                disabled={isEditingDate}
            >
                Editar date
            </button>
        </>
    )
}

export default DisplayEntryDate;