import { useState } from "react";

export default function EditableListItem({ itemData, editTaskCallback }) {

    const [description, setDescription] = useState(itemData.description)

    return (
        <li>
            <p className="task-id">{`(${itemData.id})`}</p>
            <input
                className="task-input"
                value={description}
                onChange={event => setDescription(event.target.value)}
            >
            </input>
            <button
                className="button btn-primary"
                onClick={() => {
                    console.log("Inside onClick on EditableListItem")
                    console.log(itemData)
                    console.log(itemData.id)
                    console.log(description)
                    editTaskCallback(itemData.id, description)
                }}>
                Submit
            </button>
        </li>
    );
}
