import DisplayEditableName from "./DisplayEditableName"
import DisplayEditableDuration from "./DisplayEditableDuration"
import DisplayEditableDate from "./DisplayEditableDate"
import DisplayEditableTime from "./DisplayEditableTime"
import DropdownSearch from "../Reusable/DropdownSearch"

const DisplayTaskRow = ({ task, editTask, deleteTask, currentRunningTask, setCurrentRunningTask, projectsList, createProject }) => {

    const handleNameUpdate = newName => {
        // console.log(`Updating the name of the task ${task.id},
        //              previous name ${task.name}, new name ${newName}`)
        editTask(task.id, { ...task, name: newName })
    }

    const handleProjectUpdate = newProjectID => {
        if (newProjectID !== null)
            editTask(task.id, { ...task, project: newProjectID })
        else
            editTask(task.id, { ...task, project: undefined })
    }

    const handleProjectCreation = newProjectName => {
        let newProjectID = createProject(newProjectName)
        handleProjectUpdate(newProjectID)
        return newProjectID
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
        <div className="task-row">
            {/* Task id */}
            {task.id}
            {/* Task name */}
            <div>
                <DisplayEditableName
                    id={task.id}
                    name={task.name}
                    handleNameUpdate={handleNameUpdate}
                />
            </div>
            {/* Task project */}
            <div>
                <DropdownSearch
                    buttonText={"Add a project"}
                    searchPlaceholderText={"Search a project or create a new one"}
                    optionsList={projectsList}
                    initialSelection={
                        task.project && projectsList.find(project => project.id === task.project) ?
                            projectsList.find(project => project.id === task.project).id :
                            null}
                    onCreateCallback={handleProjectCreation}
                    onSelectCallback={handleProjectUpdate}
                />
            </div>
            {/* Task start and end datetimes */}
            {/* <div>
                {(new Date(task.interval.start)).toLocaleString()} - {(new Date(task.interval.end)).toLocaleString()}
            </div> */}
            <div>
                <DisplayEditableDate
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="start"
                />
            </div>
            <div>
                <DisplayEditableTime
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="start"
                />
            </div>
            <div>
                <DisplayEditableDate
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="end"
                />
            </div>
            <div>
                <DisplayEditableTime
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="end"
                />
            </div>
            {/* Task duration */}
            <div>
                <DisplayEditableDuration
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