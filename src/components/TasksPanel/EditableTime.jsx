import React, { useState, useEffect } from "react"
import { timestampToHMS, HMSToTimestamp, timestampToTimeToDisplay } from "../../helpers/timeFormatting"
// eslint-disable-next-line no-unused-vars
const typedefs = require("../types"); // JSDoc Type Definitions

/**
 * This component will display a time, used for displaying the start and end times for the Tasks. When clicked, this component will allow the user to edit the value with an input of type time.
 * @param {Object} props - Component props object
 * @param {Number} props.id - The id of the Task associated to this component object contained in this row, used when setting the id for the input tag.
 * @param {typedefs.Interval} props.interval - The Interval object of the task, containing its timestamps.
 * @param {function(typedefs.Interval):void} props.handleIntervalUpdate - Callback function that will be fired when the changes are submitted.
 * @param {"start" | "end"} props.intervalPosition - This value tells us what position of the interval this component represents and modify the logic accordingly when submitting. This is so we can use the same component for both the start and end times.
 */
const EditableTime = ({ id, interval: { start, end }, handleIntervalUpdate, intervalPosition }) => {

    /** This will have the timestamp of whichever position was established in the props. */
    const [tempTimestamp, setTempTimestamp] = useState(intervalPosition === "start" ? start : end);
    /** This value controls the conditional rendering for when the component is in editing mode. */
    const [isEditingTime, setIsEditingTime] = useState(false);

    /** Other components also edit on the interval of the task so it is important to keep listening for changes */
    useEffect(() => setTempTimestamp(intervalPosition === "start" ? start : end), [start, end, intervalPosition])

    const handleInputChange = event => {
        // The input node keeps the value in the format 'H:MM:SS' so we calculate its timestamp, using also the original timestamp which will have the date
        let inputTimestamp = HMSToTimestamp(event.target.value, tempTimestamp)
        setTempTimestamp(inputTimestamp)
    }

    const handleSubmit = event => {
        event.preventDefault();
        //      Form Validation, make sure that if both dates happen in the same day, the start time is before the end time.
        // If this condition is violated throw an alert, reset the value of the state and turn off editing mode
        if (intervalPosition === "start" && tempTimestamp > end) {
            alert("The starting time cannot be after the end time") // TODO: Better notifications system.
            setTempTimestamp(start)
            setIsEditingTime(false)
            return
        }
        if (intervalPosition === "end" && tempTimestamp < start) {
            alert("The ending time cannot be before the starting time")
            setTempTimestamp(end)
            setIsEditingTime(false)
            return
        }
        //      Edit Task
        if (intervalPosition === "start")
            handleIntervalUpdate({ start: tempTimestamp, end })
        else
            handleIntervalUpdate({ start, end: tempTimestamp })
        //      Cleanup
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
                            className="editable compact"
                            type="time"
                            value={timestampToHMS(tempTimestamp)}
                            onChange={handleInputChange}
                            step="1"
                            autoFocus
                            onBlur={event => handleSubmit(event)}
                        />
                    </form>
                    :
                    <button
                        className="editable editable-display compact"
                        onClick={() => setIsEditingTime(true)}
                    >
                        <span>
                            {timestampToTimeToDisplay(tempTimestamp)}
                        </span>
                    </button>
            }
        </>
    )
}

export default EditableTime;