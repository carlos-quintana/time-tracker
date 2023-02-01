import DisplayEntryRow from "./DisplayEntryRow";

const PanelData = ({ entriesList, editEntry, deleteEntry }) => {

    return (
        <div>
            {
                entriesList.map((entry, i) =>
                    <DisplayEntryRow
                        key={i}
                        entry={entry}
                        deleteEntry={() => deleteEntry(entry.id)}
                        editEntry={editEntry} />
                )
            }
        </div>
    );
}

export default PanelData