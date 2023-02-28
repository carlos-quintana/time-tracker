import React, { useEffect, useRef, useState } from "react";
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
const PanelTasks = ({ tasksList: givenTasks, editTask, deleteTask, currentTask, setCurrentTask, projectsList, createProject }) => {

    const [mappedTasks, setMappedTasks] = useState({});
    const currentDate = useRef(new Date());

    useEffect(() => {
        setMappedTasks( 
            mapTasksToMilestone( // Set the organized tasks to display to an object that has them organized into milestones
                givenTasks.sort((a, b) => { // But first order the list of tasks
                    // Compare the 2 dates
                    if (a.interval.start > b.interval.start) return -1;
                    if (a.interval.start < b.interval.start) return 1;
                    return 0;
                })
            )
        )
    }, [givenTasks])

    /**
     * TODO: Take this (and the few subsequent) function(s) out into another file and write tests.
     * TODO: Look into changing the returned Object to an Array of Objects
     * This function takes an ordered list of Tasks (by starting timestamp) and categorizes them into different established milestones like Today, Yesterday, This Week, etc.
     * For this we go through each task and check if it's starting timestamp belongs to any of these milestones using different functions that compare two timestamps. Each milestone also contains a String thast will be displayed as a title of the section.
     * @param {Array<typedefs.Task>} tasksList - The list of tasks to be categorized.
     * @returns {Object} An object containing the different milestones extracted from the tasks, each containing a title and the list of tasks.
     */
    const mapTasksToMilestone = (tasksList) => {
        let newMappedTasks = {};
        tasksList.forEach(task => {
            let taskStart = new Date(task.interval.start)
            // console.log(`Sorting the task ${task.name} with date ${taskStart.toLocaleString()}`)
            if (isSameDay(currentDate.current, taskStart)) {
                if (!newMappedTasks.today)
                    newMappedTasks.today = { tasks: [], title: "Today" }
                newMappedTasks.today.tasks.push(task)
                // console.log("Appended a task to today")
                return
            }
            if (isYesterday(currentDate.current, taskStart)) {
                if (!newMappedTasks.yesterday)
                    newMappedTasks.yesterday = { tasks: [], title: "Yesterday" }
                newMappedTasks.yesterday.tasks.push(task)
                // console.log("Appended a task to yesterday")
                return
            }
            if (isSameWeek(taskStart, currentDate.current)) {
                if (!newMappedTasks.thisWeek)
                    newMappedTasks.thisWeek = { tasks: [], title: "This Week" }
                newMappedTasks.thisWeek.tasks.push(task)
                // console.log("Appended a task to this week")
                return
            }
            else {
                if (!newMappedTasks.older)
                    newMappedTasks.older = { tasks: [], title: "Older" }
                newMappedTasks.older.tasks.push(task)
                // console.log("Appended a task to older")
                return
            }
        })
        return newMappedTasks;
    }

    const isSameDay = (dateA, dateB) => {
        return dateA.getDate() === dateB.getDate() && dateA.getMonth() === dateB.getMonth() && dateA.getFullYear() === dateB.getFullYear()
    }

    const isYesterday = (dateA, dateB) => {
        return dateA.getDate() - 1 === dateB.getDate() && dateA.getMonth() === dateB.getMonth() && dateA.getFullYear() === dateB.getFullYear()
    }

    const isSameWeek = (dateA, dateB) => {
        return dateA.valueOf() >= dateB.valueOf() - 1000 * 60 * 60 * 24 * 7
    }

    return (
        <section>
            {Object.keys(mappedTasks).map(milestone =>
                // This represents each one of the separators in the list of tasks
                <>
                    <h3 key={mappedTasks[milestone].title}>
                        {mappedTasks[milestone].title}
                    </h3>
                    {mappedTasks[milestone].tasks.map(task =>
                        <>
                            {<TaskRow
                                key={task.id}
                                task={task}
                                deleteTask={() => deleteTask(task.id)}
                                editTask={editTask}
                                currentTask={currentTask}
                                setCurrentTask={setCurrentTask}
                                projectsList={projectsList}
                                createProject={createProject}
                            />}
                        </>
                    )}
                </>
            )}
        </section>
    );
}

export default PanelTasks