import React, { useEffect, useState } from "react"
import { secondsToFormattedHMS, formattedHMSToSeconds } from "../../helpers/timeFormatting"
import InputDuration from "./InputDuration"
// eslint-disable-next-line no-unused-vars
const typedefs = require("../types"); // JSDoc Type Definitions

/**
 * This component will display a time, not as in a time in a 24h day but as in an arbitrary amount of time in the same shape of Hours, Minutes and Seconds, used for displaying the total duration of any task calculated using the start and end timestamps. When clicked, this component will allow the user to edit the value with another component that will act as an input for this custom format, so that it constraints the input to a valid format.
 * @param {Object} props - Component props object
 * @param {Number} props.id - The id of the Task associated to this component object contained in this row, used when setting the id for the input tag.
 * @param {typedefs.Interval} props.interval - The Interval object of the task, containing its timestamps.
 * @param {function(typedefs.Interval):void} props.handleIntervalUpdate - Callback function that will be fired when the changes are submitted.
 */
const EditableDuration = ({ id, interval: { start, end }, handleIntervalUpdate }) => {

    /** This will be a whole number that will keep track of the duration of the interval in seconds. This number will be used to calculate the HMS string which will be displayed and provided to the custom input duration component */
    const [durationSeconds, setDurationSeconds] = useState(Math.floor((end - start) / 1000))
    /** This value controls the conditional rendering for when the component is in editing mode. */
    const [isEditingDuration, setIsEditingDuration] = useState(false)

    /** Other components also edit on the interval of the task so it is important to keep listening for changes. */
    useEffect(() => setDurationSeconds(Math.floor((end - start) / 1000)), [start, end])

    const handleSubmit = event => {
        event.preventDefault()
        // The string given to us by the custom input duration component
        let inputDurationString = event.target.value;
        //      Form Validations
        // Validate the string is of the form H+:MM:SS
        if (!((/^\d+:[012345]\d:[012345]\d$/).test(inputDurationString))) {
            alert("An error has ocurred, the inputted duration is not valid") // TODO: Implement a better notifications system.
            setIsEditingDuration(false)
            return
        }
        if (formattedHMSToSeconds(inputDurationString) <= 0) {
            alert("The duration cannot be zero")
            setIsEditingDuration(false)
            return
        }
        //      Edit submission
        handleIntervalUpdate({ start, end: (start + formattedHMSToSeconds(inputDurationString) * 1000) })
        //      Cleanup
        setIsEditingDuration(false)
    }

    return (
        <>
            {
                isEditingDuration ?
                    <form onSubmit={event => handleSubmit(event)}>
                        <InputDuration
                            id={id}
                            durationSeconds={durationSeconds}
                            handleSubmit={handleSubmit}
                        />
                    </form>
                    :
                    <button
                        className="editable editable-display"
                        onClick={() => setIsEditingDuration(true)}
                    >
                        <span>
                            {secondsToFormattedHMS(durationSeconds)}s
                        </span>
                    </button>
            }
        </>
    )
}

export default EditableDuration;