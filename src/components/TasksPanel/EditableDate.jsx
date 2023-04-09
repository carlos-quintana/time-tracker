import React, { useState, useEffect } from "react"
import { timestampToDateSnake, dateSnakeToTimestamp, timestampToDateToDisplay } from "../../helpers/timeFormatting"
// eslint-disable-next-line no-unused-vars
const typedefs = require("../types"); // JSDoc Type Definitions

/**
 * This component will display a date, used for displaying the start and end dates for the Tasks. When clicked, this component will allow the user to edit the value with an input of type date.
 * @param {Object} props - Component props object
 * @param {Number} props.id - The id of the Task associated to this component object contained in this row, used when setting the id for the input tag.
 * @param {typedefs.Interval} props.interval - The Interval object of the task, containing its timestamps.
 * @param {function(typedefs.Interval):void} props.handleIntervalUpdate - Callback function that will be fired when the changes are submitted.
 * @param {"start" | "end"} props.intervalPosition - This value tells us what position of the interval this component represents and modify the logic accordingly when submitting. This is so we can use the same component for both the start and end dates.
 */
const EditableDate = ({ id, interval: { start, end }, handleIntervalUpdate, intervalPosition }) => {

    /** This will have the timestamp of whichever position was established in the props. */
    const [tempTimestamp, setTempTimestamp] = useState(intervalPosition === "start" ? start : end)
    /** This value controls the conditional rendering for when the component is in editing mode. */
    const [isEditingDate, setIsEditingDate] = useState(false)

    /** Other components also edit on the interval of the task so it is important to keep listening for changes */
    useEffect(() => setTempTimestamp(intervalPosition === "start" ? start : end), [start, end, intervalPosition])

    const handleInputChange = event => {
        // The input node keeps the value in the format 'YYYY-MM-DD' so we calculate its timestamp, using also the original timestamp which will have the time
        let formattedDate = dateSnakeToTimestamp(event.target.value, tempTimestamp)
        setTempTimestamp(formattedDate)
    }

    const handleSubmit = event => {
        event.preventDefault()
        //      Form Validation
        // This condition is to prevent the HTML time picker component to be cleared and the form submitted
        if (!tempTimestamp) {
            abortSubmit("The date inputted is not valid"); return;
        }
        // Make sure that if both dates happen in the same day, the start time is before the end time (and for more than 1s).
        // If this component is for the start date and the selected date is after the end.
        if (intervalPosition === "start" && tempTimestamp > end) {
            abortSubmit("The starting date cannot be after the end date"); return;
        }
        // If this component is for the end date and the selected date is before the start.
        if (intervalPosition === "end" && tempTimestamp < start) {
            abortSubmit("The ending date cannot be before the end date"); return;
        }

        //      Update Task
        if (intervalPosition === "start")
            handleIntervalUpdate({ start: tempTimestamp, end })
        else
            handleIntervalUpdate({ start, end: tempTimestamp })
        //      Cleanup
        setIsEditingDate(false)
    }

    /**
     * This component has enough different validations and escape conditions that it warrants having a separate function for handling the errors.
     * @param {string} message - The message to display in the alert
     */
    const abortSubmit = message => {
        console.log("ERROR " + message); // TODO: Implement a better notification system
        setTempTimestamp(intervalPosition === "start" ? start : end)
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
                            className="editable compact"
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
                        className="editable editable-display compact"
                        onClick={() => setIsEditingDate(true)}
                    >
                        <span>
                            {timestampToDateToDisplay(tempTimestamp)}
                        </span>
                    </button>
            }
        </>
    )
}

export default EditableDate;