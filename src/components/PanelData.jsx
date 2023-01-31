import DisplayTaskRow from "./DisplayTaskRow";

const PanelData = ({ tasksList, editTask, deleteTask }) => {

    return (
        <div>
            {
                tasksList.map((task, i) =>
                    <DisplayTaskRow
                        key={i}
                        task={task}
                        deleteTask={() => deleteTask(task.id)}
                        editTask={editTask} />
                )
            }
        </div>
    );
}

export default PanelData