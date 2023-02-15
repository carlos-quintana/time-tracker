import DisplayTaskRow from "./DisplayTaskRow";

const PanelData = ({ tasksList, editTask, deleteTask, currentRunningTask, setCurrentRunningTask, projectsList, createProject }) => {

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
                        projectsList={projectsList}
                        createProject={createProject}
                    />
                )
            }
        </div>
    );
}

export default PanelData