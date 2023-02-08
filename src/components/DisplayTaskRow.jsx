import DisplayTaskName from "./DisplayTaskName"
import DisplayTaskDuration from "./DisplayTaskDuration"
import DisplayTaskDate from "./DisplayTaskDate"
import DisplayTaskTime from "./DisplayTaskTime"

const DisplayTaskRow = ({ task, editTask, deleteTask, currentRunningTask, setCurrentRunningTask }) => {

    const handleNameUpdate = newName => {
        // console.log(`Updating the name of the task ${task.id},
        //              previous name ${task.name}, new name ${newName}`)
        editTask(task.id, { ...task, name: newName })
    }

    const handleIntervalUpdate = newInterval => {
        // console.log(`Updating the interval of the task ${task.id},\n 
        //              previous interval ${task.interval.start}-${task.interval.end}, \n${new Date(task.interval.start)}-${new Date(task.interval.end)}\n
        //              new interval ${newInterval.start}-${newInterval.end}, \nnew interval ${new Date(newInterval.start)}-${new Date(newInterval.end)}`)
        editTask(task.id, { ...task, interval: newInterval })
    }

    const handleDeleteTask = () => deleteTask(task.id)

    const handleRestartTask = () => {
        if (currentRunningTask) 
            alert("There is an active task currently running in the timer. To restart this task please stop the active task")  // <- Change for a modal in the future
         else 
         setCurrentRunningTask({ name: task.name, starterTimestamp: Date.now() })
    }

    return (
        <div>
            {/* Task id */}
            {task.id}
            {/* Task name */}
            <div>
                <DisplayTaskName
                    id={task.id}
                    name={task.name}
                    handleNameUpdate={handleNameUpdate}
                />
            </div>
            {/* Task start and end datetimes */}
            <div>
                {(new Date(task.interval.start)).toLocaleString()} - {(new Date(task.interval.end)).toLocaleString()}
            </div>
            <div>
                <DisplayTaskDate
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="start"
                />
            </div>
            <div>
                <DisplayTaskTime
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="start"
                />
            </div>
            <div>
                <DisplayTaskDate
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="end"
                />
            </div>
            <div>
                <DisplayTaskTime
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="end"
                />
            </div>
            {/* Task duration */}
            <div>
                <DisplayTaskDuration
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                />
            </div>
            {/* Task delete button */}
            <button
                onClick={() => handleDeleteTask()}
                disabled={false}
            >
                Delete
            </button>
            {/* Restart this task button */}
            <button
                onClick={handleRestartTask}
                // disabled={currentRunningTask}
            >
                Restart this task
            </button>
        </div>
    );
}

export default DisplayTaskRow