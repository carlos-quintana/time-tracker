import React, { useState } from "react"
import { secondsToFormattedHMS } from "../helpers/timeFormatting"

const DisplayTaskDuration = ({ id, interval: { start, end }, handleIntervalUpdate }) => {

    const duration = Math.floor((end - start) / 1000)

    const [tempDuration, setTempDuration] = useState(duration)
    const [isEditingDuration, setIsEditingDuration] = useState(false)

    const handleSubmit = event => {
        event.preventDefault()
        // console.log(`An edit for the duration has been submitted for the task ${id}`)
        // Form validations
        if (tempDuration === duration) {
            setIsEditingDuration(false)
            return
        }
        if (tempDuration === "") {
            alert("The duration cannot be empty") // #TODO Implement a better notification
            return
        }
        // Edit submission
        // console.log("About to fire the handleIntervalUpdate")
        handleIntervalUpdate({ start, end: (start + tempDuration * 1000) })
        // Cleanup
        setIsEditingDuration(false)
    }

    return (
        <>
            {
                isEditingDuration ?
                    <form onSubmit={event => handleSubmit(event)}>
                        <input
                            id={`${id}-editTaskDuration`}
                            name="editTaskDuration"
                            type="text"
                            value={tempDuration}
                            onChange={event => setTempDuration(event.target.value)}
                            autoFocus
                            onBlur={event => handleSubmit(event)}
                        />
                    </form>
                    :

                    <button
                        onClick={() => setIsEditingDuration(true)}
                    >
                        <span>
                            {secondsToFormattedHMS(duration)}
                        </span>
                    </button>
            }
            {/* <button
                onClick={() => setIsEditingDuration(true)}
                disabled={isEditingDuration}
            >
                Editar duración
            </button> */}
        </>
    )
}

export default DisplayTaskDuration;