import React, { useEffect, useState } from "react"
import { secondsToFormattedHMS, formattedHMSToSeconds } from "../helpers/timeFormatting"
import InputTimeCustom from "./InputTimeCustom"

const calculateSeconds = (start, end) => Math.floor((end - start) / 1000);

const DisplayTaskDuration = ({ id, interval: { start, end }, handleIntervalUpdate }) => {

    // This will be a Number to keep track of the seconds corresponding to the duration of the interval, the number will be used to calculate the HMS string and this in turn will be provided to the custom input component.
    const [durationSeconds, setDurationSeconds] = useState(calculateSeconds(start, end))
    const [isEditingDuration, setIsEditingDuration] = useState(false)

    // This updates the HMS to display whenever the interval is updated
    useEffect(() => setDurationSeconds(calculateSeconds(start, end)), [start, end])

    const handleSubmit = event => {
        // console.log("> Inside of handle Submit")
        event.preventDefault()
        console.log(`An edit for the duration has been submitted for the task ${id}`)
        console.log(event)
        console.log(event.target)
        console.log(event.target.value)
        let inputDurationString = event.target.value;
        // Validate the string is of the form H+:MM:SS
        if (!((/^\d+:[012345]\d:[012345]\d$/).test(inputDurationString))) {
            alert("An error has ocurred, the inputted duration is not valid")
            setIsEditingDuration(false)
            return
        }
        if (formattedHMSToSeconds(inputDurationString)===0) {
            alert("The duration cannot be zero")
            setIsEditingDuration(false)
            return

        }
        // Edit submission
        handleIntervalUpdate({ start, end: (start + formattedHMSToSeconds(inputDurationString) * 1000) })
        // Cleanup
        setIsEditingDuration(false)
        // console.log("< Outside of handle Submit")
    }

    return (
        <>{isEditingDuration ?
            <form onSubmit={event => handleSubmit(event)}>
                <InputTimeCustom
                    id={id}
                    durationSeconds={durationSeconds}
                    handleSubmit={handleSubmit}
                />
            </form>
            :
            <button
                onClick={() => setIsEditingDuration(true)}
            >
                <span>
                    {secondsToFormattedHMS(durationSeconds)}s
                </span>
            </button>
        }</>
    )
}

export default DisplayTaskDuration;