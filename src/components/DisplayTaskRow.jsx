    const DisplayTaskRow = ({ task: { id, name, duration }, deleteTask }) => {
    const handleDeleteTask = () => {
        deleteTask(id)
    }

    return (
        <div>
            {id}
            {/* Task name */}
                <span> {name}</span>
            | | |
                <span> {duration}s</span>
            <button
                onClick={() => handleDeleteTask()}>
                Eliminar
            </button>
        </div>
    );
}

export default DisplayTaskRow