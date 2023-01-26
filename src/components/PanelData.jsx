const PanelData = ({ tasksList, deleteTask }) => {
    return (
        < ul >
            {
                tasksList.map((task, i) =>
                    <>
                        <li key={i}>{task.duration} | {task.name}</li>
                        <button onClick={() => deleteTask(task.id)}>X</button>
                    </>
                )
            }
        </ul >
    );
}

export default PanelData