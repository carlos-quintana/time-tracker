import React, { useEffect, useState } from "react"


/**
 * This variable will set the limit for the text input in the component. After the limit is reached it will display a warning to the user.
 * @type {Number}
 */
const MAX_NAME_LENGTH = 60;

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

    const handleNameChange = event => {
        // This line will take the input given by the user and remove any trailing white spaces. There is the special condition where the user uses one single space at the end to separate words though.
        let newName = event.target.value.slice(-1) === " " ?
            event.target.value.trim() + " " :
            event.target.value.trim();
        // Check the length of the name is valid. If the user exceeds this limit stop adding characters to the input and fire the notification
        if (newName.length > MAX_NAME_LENGTH) {
            console.log("ERROR: The name you're trying to input is too long") // TODO: Implement a better notification
            setTempName(newName.slice(0, MAX_NAME_LENGTH));
            return;
        }
        setTempName(newName);
    }

    const handleSubmit = event => {
        event.preventDefault()
        //      Form Validation
        let newName = tempName.trim();
        // If the name is the same don't even update the state
        if (newName === name) {
            setIsEditingName(false); return;
        }
        // Do not allow empty names
        if (newName === "") {
            abortSubmit("The name cannot be empty"); return;
        }
        // Check for the length once again 
        if (newName.length > MAX_NAME_LENGTH) {
            abortSubmit("The name is too long"); return;
        }
        //      Update Task
        handleNameUpdate(tempName)
        //      Cleanup
        setIsEditingName(false)
    }

    /**
     * This component has enough different validations and escape conditions that it warrants having a separate function for handling the errors.
     * @param {string} message - The message to display in the alert
     */
    const abortSubmit = message => {
        console.log("ERROR " + message); // TODO: Implement a better notification system
        setTempName(name)
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
                            onChange={handleNameChange}
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