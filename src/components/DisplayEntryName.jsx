import React, { useState } from "react"

const DisplayEntryName = ({ id, name, handleNameUpdate }) => {

    const [tempName, setTempName] = useState(name)
    const [isEditingName, setIsEditingName] = useState(false)

    const handleSubmit = event => {
        event.preventDefault()
        console.log(`An edit for the name has been submitted for the entry ${id}`)
        // Form validations
        if (tempName === name) {
            setIsEditingName(false)
            return
        }
        if (tempName === "") {
            alert("The name cannot be empty") // #TODO Implement a better notification
            return
        }
        // Edit submission
        console.log("About to fire the handleNameUpdate")
        handleNameUpdate(tempName)
        // Cleanup
        setIsEditingName(false)
    }

    return (
        <>
            {
                isEditingName ?
                    <form onSubmit={event => handleSubmit(event)}>
                        <input
                            id={`${id}-editEntryName`}
                            name="editEntryName"
                            type="text"
                            value={tempName}
                            onChange={event => setTempName(event.target.value)}
                            autoFocus
                            onBlur={event => handleSubmit(event)}
                        />
                    </form>
                    :
                    <span>
                        {name}
                    </span>
            }
            <button
                onClick={() => setIsEditingName(true)}
                disabled={isEditingName}
            >
                Editar nombre
            </button>
        </>
    )
}

export default DisplayEntryName;