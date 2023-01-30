import { secondsToFormattedHMS } from "../helpers/timeConversion"

    const handleDeleteTask = () => {
        deleteTask(id)
    }

    return (
        <div>
            {id}
            {/* Task name */}
                <span> {name}</span>
            | | |
                <span> {secondsToFormattedHMS(duration)}</span>
            <button
                onClick={() => handleDeleteTask()}>
                Eliminar
            </button>
        </div>
    );
}

export default DisplayTaskRow