import DisplayEntryRow from "./DisplayEntryRow";

const PanelData = ({ entriesList, editEntry, deleteEntry, currentRunningTask, setCurrentRunningTask }) => {

    return (
        <div>
            {
                entriesList.map((entry, i) =>
                    <DisplayEntryRow
                        key={i}
                        entry={entry}
                        deleteEntry={() => deleteEntry(entry.id)}
                        editEntry={editEntry}
                        currentRunningTask={currentRunningTask}
                        setCurrentRunningTask={setCurrentRunningTask}
                    />
                )
            }
        </div>
    );
}

export default PanelData