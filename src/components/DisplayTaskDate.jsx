import React, { useState, useEffect } from "react"
import { timestampToDateSnake, dateSnakeToTimestamp, timestampToDateToDisplay } from "../helpers/timeFormatting"

const DisplayTaskDate = ({ id, interval: { start, end }, handleIntervalUpdate, intervalPosition }) => {

    // The component will hold the date in the state in the form of a UNIX timestamp
    const [tempTimestamp, setTempTimestamp] = useState(intervalPosition === "start" ? start : end)
    const [isEditingDate, setIsEditingDate] = useState(false)

    useEffect(() => setTempTimestamp(intervalPosition === "start" ? start : end), [start, end, intervalPosition])

    const handleInputChange = event => {
        let formattedDate = dateSnakeToTimestamp(event.target.value, tempTimestamp)
        setTempTimestamp(formattedDate)
    }

    const handleSubmit = event => {
        event.preventDefault()
        // console.log(`An edit for the ${intervalPosition === "start" ? "start" : "end"} date field has been submitted for the task ${id}`)
        // console.log({ tempDate: tempTimestamp })
        // console.log({ tempDate: new Date(tempTimestamp) })
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

        // Edit Task
        // console.log("About to fire the handleIntervalUpdate")
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
                            id={`${id}-editTask${intervalPosition === "start" ? "Start" : "End"}Date`}
                            name={`editTask${intervalPosition === "start" ? "Start" : "End"}Date`}
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
                    <button
                        onClick={() => setIsEditingDate(true)}
                    >
                        <span>
                            {timestampToDateToDisplay(tempTimestamp)}
                        </span>
                    </button>
            }
            {/* <button
                onClick={() => setIsEditingDate(true)}
                disabled={isEditingDate}
            >
                Editar date
            </button> */}
        </>
    )
}

export default DisplayTaskDate;