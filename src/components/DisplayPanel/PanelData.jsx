import DisplayTaskRow from "./DisplayTaskRow";

const PanelData = ({ tasksList, editTask, deleteTask, currentRunningTask, setCurrentRunningTask, projectsList }) => {

    return (
        <>
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
                        />
                    )
                }
            </div>
            <div>
                <h3>Projects list:</h3>
                <ul>
                    {
                        projectsList?.map((project, i) =>
                            <li key={i}>
                                {project.id} | {project.name}
                            </li>
                        )
                    }
                </ul>
            </div>
        </>
    );
}

export default PanelData