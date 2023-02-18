import React from "react";
import DropdownSearch from "../Shared Components/DropdownSearch"
import EditableName from "./EditableName"
import EditableDate from "./EditableDate"
import EditableTime from "./EditableTime"
import EditableDuration from "./EditableDuration"
// eslint-disable-next-line no-unused-vars
const typedefs = require("../types"); // JSDoc Type Definitions

/**
 * This component contains all the data of the Tasks that will be displayed and also the controls to edit the different fields, as well as the controls to delete the Task or create a new Task in the timer with the same data (restart the Task).
 * @param {Object} props - Component props object
 * @param {typedefs.Task} props.task - The Task object contained in this row.
 * @param {function(Number,typedefs.Task):void} props.editTask - Callback function that will be fired when any of the fields of a Task is edited.
 * @param {function():void} props.deleteTask - Callback function that will be fired when the delete controls of the Task are triggered.
 * @param {null | typedefs.CurrentTask} props.currentTask - The current running Task state that represents the current task in the Timer. (The state initializes as null but it should change to CurrentTask after it's mounted). This is used to check if there's a Current Task running at the moment.
 * @param {Function} props.setCurrentTask - Callback function that will set the state for the new current running task when the restart control is triggered.
 * @param {Array<typedefs.Project>} props.projectsList - The list of existing projects. This is used in the Dropdown component that is used to select a project to assign the task to.
 * @param {function(String):Number} props.createProject - Callback function that will be fired when the form is used to create a new Project.
 */
const TaskRow = ({ task, editTask, deleteTask, currentTask, setCurrentTask, projectsList, createProject }) => {

    /** @param {String} newName - The new name for the Task. */
    const handleNameUpdate = newName => {
        editTask(task.id, { ...task, name: newName })
    }

    /** @param {null | Number} newProjectID - The id for the project to assign to this task. If a null value is passed then the project is removed. */
    const handleProjectUpdate = newProjectID => {
        if (newProjectID !== null)
            editTask(task.id, { ...task, project: newProjectID })
        else
            editTask(task.id, { ...task, project: undefined })
    }

    /**  This function is used when a project is created in the Dropdown component.
     * @param {String} newProjectName - The name for the new project.
     * @returns {Number} - The id of the newly created project */
    const handleProjectCreation = newProjectName => {
        let newProjectID = createProject(newProjectName)
        handleProjectUpdate(newProjectID)
        return newProjectID
    }

    /** This method can be triggered from different components inside of this row, such as the Date, Time and Duration components.
     *  @param {typedefs.Interval} newInterval - The new Interval object to assign to the task */
    const handleIntervalUpdate = newInterval =>
        editTask(task.id, { ...task, interval: newInterval })

    /** The id of the Task to delete was already assigned in the parent component. */
    const handleDeleteTask = () =>
        deleteTask() // TODO: Add a confirmation message before deleting the Task

    /** This will set the current Task to a Task with the same details as this one starting from the moment the button is pressed. */
    const handleRestartTask = () => {
        if (currentTask)
            alert("There is an active task currently running in the timer. To restart this task please stop the active task")  // TODO: Implement a better alert system, maybe a modal or a tooltip
        else
            setCurrentTask({ name: task.name, start: Date.now() })
    }

    return (
        <div className="task-row">
            {/* Task id */}
            {task.id}
            {/* Task name */}
            <div>
                <EditableName
                    id={task.id}
                    name={task.name}
                    handleNameUpdate={handleNameUpdate}
                />
            </div>
            {/* Task project */}
            <div>
                <DropdownSearch
                    defaultText={"Add a project"}
                    searchPlaceholder={"Search a project or create a new one"}
                    optionsList={
                        projectsList.map(project => {
                            return { id: project.id, value: project.name }
                        })}
                    initialSelection={projectsList.find(project => project.id === task.project)?.id || null}
                    onCreateCallback={handleProjectCreation}
                    onSelectCallback={handleProjectUpdate}
                />
            </div>
            {/* Task start and end datetimes */}
            <div>
                <EditableDate
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="start"
                />
            </div>
            <div>
                <EditableTime
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="start"
                />
            </div>
            <div>
                <EditableDate
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="end"
                />
            </div>
            <div>
                <EditableTime
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="end"
                />
            </div>
            {/* Task duration */}
            <div>
                <EditableDuration
                    id={task.id}
                    interval={task.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                />
            </div>
            {/* Task delete button */}
            <button onClick={() => handleDeleteTask()}>
                Delete
            </button>
            {/* Restart this task button */}
            <button onClick={handleRestartTask}>
                Restart this task
            </button>
        </div>
    );
}

export default TaskRow;