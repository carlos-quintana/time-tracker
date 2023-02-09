import DisplayTaskRow from "./DisplayTaskRow";

const PanelData = ({ tasksList, editTask, deleteTask, currentRunningTask, setCurrentRunningTask }) => {

    return (
        <div>
            {
                tasksList.map((task, i) =>
                    <DisplayTaskRow
                        key={i}
                        task={task}
                        deleteTask={() => deleteTask(task.id)}
                        editTask={editTask}
                        currentRunningTask={currentRunningTask}
                        setCurrentRunningTask={setCurrentRunningTask}
                    />
                )
            }
        </div>
    );
}

export default PanelData