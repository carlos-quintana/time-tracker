import { useState } from "react";

export default function EditableListItem({ itemData, editTaskCallback }) {

    const [description, setDescription] = useState(itemData.description)

    return (
        <div>
            <li>
                {`(${itemData.id}) `}
                <input
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                >
                </input>
                <button onClick={() => {
                    console.log("Inside onClick on EditableListItem")
                    console.log(itemData)
                    console.log(itemData.id)
                    console.log(description)
                    editTaskCallback(itemData.id, description)
                }}>
                    Submit
                </button>
            </li>
        </div>
    );
}
