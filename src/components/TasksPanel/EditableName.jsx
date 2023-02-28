import React, { useEffect, useState } from "react"

/**
 * This component will display the name of the Task. When clicked, this component will allow the user to edit the value with an input of type text.
 * @param {Object} props - Component props object
 * @param {Number} props.id - The id of the Task associated to this component object contained in this row, used when setting the id for the input tag.
 * @param {String} props.name - The name the Task already has.
 * @param {function(String):void} props.handleNameUpdate - Callback function that will be fired when the changes are submitted.
 */
const EditableName = ({ id, name, handleNameUpdate }) => {

    /** This will be used to control the input tag. */
    const [tempName, setTempName] = useState(name)
    /** This value controls the conditional rendering for when the component is in editing mode. */
    const [isEditingName, setIsEditingName] = useState(false)

    /** This will be used to control the input tag. */
    useEffect(() => setTempName(name), [name])

    const handleSubmit = event => {
        event.preventDefault()
        //      Form Validation
        if (tempName === name) {
            // If the name is the same don't even update the state
            setIsEditingName(false)
            return
        }
        if (tempName === "") {
            // Do not allow empty names
            alert("The name cannot be empty") // #TODO Implement a better notification
            setTempName(name)
            return
        }
        //      Update Task
        handleNameUpdate(tempName)
        //      Cleanup
        setIsEditingName(false)
    }

    return (
        <>
            {
                isEditingName ?
                    <form onSubmit={event => handleSubmit(event)}>
                        <input
                            id={`${id}-editTaskName`}
                            name="editTaskName"
                            className="editable"
                            type="text"
                            value={tempName}
                            onChange={event => setTempName(event.target.value)}
                            autoFocus
                            onBlur={event => handleSubmit(event)}
                        />
                    </form>
                    :
                    <button
                        className="editable editable-display"
                        title={name}
                        onClick={() => setIsEditingName(true)}
                    >
                        <span>
                            {name}
                        </span>
                    </button>
            }
        </>
    )
}

export default EditableName;