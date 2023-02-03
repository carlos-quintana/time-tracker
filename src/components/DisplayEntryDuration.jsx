import React, { useState } from "react"
import { secondsToFormattedHMS } from "../helpers/timeConversion"

const DisplayEntryDuration = ({ id, interval: { start, end }, handleIntervalUpdate }) => {

    const duration = Math.floor((end - start) / 1000)

    const [tempDuration, setTempDuration] = useState(duration)
    const [isEditingDuration, setIsEditingDuration] = useState(false)

    const handleSubmit = event => {
        event.preventDefault()
        console.log(`An edit for the duration has been submitted for the entry ${id}`)
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
        console.log("About to fire the handleIntervalUpdate")
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
                            id={`${id}-editEntryDuration`}
                            name="editEntryDuration"
                            type="text"
                            value={tempDuration}
                            onChange={event => setTempDuration(event.target.value)}
                            autoFocus
                            onBlur={event => handleSubmit(event)}
                        />
                    </form>
                    :
                    <span>
                        {secondsToFormattedHMS(duration)}
                    </span>
            }
            <button
                onClick={() => setIsEditingDuration(true)}
                disabled={isEditingDuration}
            >
                Editar duración
            </button>
        </>
    )
}

export default DisplayEntryDuration;