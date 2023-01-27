import DisplayTaskRow from "./DisplayTaskRow";
    return (
        <div>
            {
                tasksList.map((task, i) =>
                    <DisplayTaskRow
                        key={i}
                        task={task}
                        deleteTask={() => deleteTask(task.id)} />
                )
            }
        </div>
    );
}

export default PanelData