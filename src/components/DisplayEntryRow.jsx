import { secondsToFormattedHMS } from "../helpers/timeConversion"
import React, { useEffect, useState } from "react"

const DisplayEntryRow = ({ entry: { id, name, duration }, editEntry, deleteEntry }) => {
    // These state variables are kept on the editing forms
    const [editingName, setTempName] = useState(name)
    const [editingDuration, setTempDuration] = useState(duration)
    // With these variables we use conditional rendering to show or hide the editing forms
    const [isEditingName, setIsEditingName] = useState(false)
    const [isEditingTime, setIsEditingTime] = useState(false)
    // Update the inner entry state used for editing, everytime the props change
    useEffect(() => {
        setTempName(name)
        setTempDuration(duration)
    }, [name, duration])
    // When the forms are submitted we check the inputs and then send the new entry up in the callbacks
    const handleSubmit = event => {
        event.preventDefault()
        console.log(`An edit has been submitted for the entry ${id}`)
        if (editingName !== "")
            setIsEditingName(false)
        else
            alert("The name cannot be empty!") // #TODO Implement a better notification

        if (editingDuration !== "")  // #TODO Implement a better check for the new time
            setIsEditingTime(false)
        else
            alert("The name cannot be empty!") // #TODO Implement a better notification
        
        // If there are no changes we can skip making the call to edit the entry as it is not necessary
        if (editingName === name) return
        if (editingDuration === duration) return
        
        console.log("Submitting an edit entry, event: ", event)
        editEntry(id, { id, name: editingName, duration: editingDuration })
    }

    const handleDeleteEntry = () => {
        deleteEntry(id)
    }

    return (
        <div>
            {id}
            {/* Entry name */}
            {isEditingName ?
                <form onSubmit={event => handleSubmit(event)}>
                    <input
                        id={`${id}-editEntryName`}
                        name="editEntryName"
                        type="text"
                        value={editingName}
                        onChange={event => setTempName(event.target.value)}
                        autoFocus
                        onBlur={event => handleSubmit(event)}
                    />
                </form>
                :
                <span> {name}</span>
            }
            | | |
            {isEditingTime ?
                <form onSubmit={event => handleSubmit(event)}>
                    <input
                        id={`${id}-editEntryDuration`}
                        name="editEntryDuration"
                        type="text"
                        value={editingDuration}
                        onChange={event => setTempDuration(event.target.value)}
                        autoFocus
                        onBlur={event => handleSubmit(event)}
                    />
                </form>
                :
                <span> {secondsToFormattedHMS(duration)}</span>
            }
            <button
                onClick={() => setIsEditingName(true)}
                disabled={isEditingName}>
                Editar nombre
            </button>
            <button
                onClick={() => setIsEditingTime(true)}
                disabled={isEditingTime}>
                Editar duración
            </button>
            <button
                onClick={() => handleDeleteEntry()}>
                Eliminar
            </button>
        </div>
    );
}

export default DisplayEntryRow