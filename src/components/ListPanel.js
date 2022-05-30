import { useEffect, useState } from "react";
import ListItem from "./ListItem"
import EditableListItem from "./EditableListItem"

export default function ListPanel({ entriesList, deleteTaskCallback, editTaskCallback }) {

    const [editableEntries, setEditableEntries] = useState(entriesList.map(_ => false));

    useEffect(() => setEditableEntries(entriesList.map(() => false)), [entriesList]);

    const handlePressedEdit = (id, taskIndex) => {
        console.log(`Requested to edit the task with id ${id} in the position ${taskIndex}`)
        setEditableEntries(
            editableEntries.map(
                (value, index) => index === taskIndex ? true : value
            )
        )
    }

    console.log("Entries list", entriesList)
    console.log("Editable entries list", editableEntries)
    return (
        <>
            <h2>List panel:</h2>
            <ul>
                {entriesList.map((entry, index) =>
                    editableEntries[index] ?
                        <EditableListItem
                            key={index}
                            itemData={entry}
                            editTaskCallback={editTaskCallback}
                        />
                        :
                        <ListItem
                            key={index}
                            itemData={entry}
                            deleteTaskCallback={deleteTaskCallback}
                            editTaskCallback={id => handlePressedEdit(id, index)}
                        />
                )}
            </ul>
        </>
    );
}
