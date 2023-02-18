import React from "react";
import TaskRow from "./TaskRow";
// eslint-disable-next-line no-unused-vars
const typedefs = require("../types"); // JSDoc Type Definitions

/**
 * This component is used to organize and display the list of Tasks and their corresponding information and controls.
 * @param {Object} props - Component props object
 * @param {Array<typedefs.Task>} props.tasksList - The list of all the Tasks in state
 * @param {function(Number,typedefs.Task):void} props.editTask - Callback function that will be fired when any of the fields of a Task is edited.
 * @param {function(Number):void} props.deleteTask - Callback function that will be fired when any of the delete controls for a Task is triggered.
 * @param {null | typedefs.CurrentTask} props.currentTask - The current running Task state that represents the current task in the Timer. (The state initializes as null but it should change to CurrentTask after it's mounted)
 * @param {Function} props.setCurrentTask - Callback function that will set the state for the new current running task, set in the Timer.
 * @param {Array<typedefs.Project>} props.projectsList - The list of existing projects. This is used in the Dropdown component that is used to select a project to assign the task to.
 * @param {function(String):Number} props.createProject - Callback function that will be fired when the form is used to create a new Project.
 */
const PanelTasks = ({ tasksList, editTask, deleteTask, currentTask, setCurrentTask, projectsList, createProject }) => {

    return (
        <div>
            {tasksList.map(task =>
                    <TaskRow
                        key={task.id}
                        task={task}
                        deleteTask={() => deleteTask(task.id)}
                        editTask={editTask}
                        currentTask={currentTask}
                        setCurrentTask={setCurrentTask}
                        projectsList={projectsList}
                        createProject={createProject}
                    />
                )}
        </div>
    );
}

export default PanelTasks