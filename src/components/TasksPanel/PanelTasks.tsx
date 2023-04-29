import { useEffect, useRef, useState } from "react";
import TaskRow from "./TaskRow";
import { Task, Project, CurrentTask, MappedTasksToMilestones } from "../../types";
import mapTasksToMilestone from "../../helpers/task-milestones/milestones";

type Props = {
    tasksList: Task[],
    editTask: Function,
    deleteTask: Function,
    currentTask: CurrentTask | null,
    setCurrentTask: Function,
    projectsList: Project[],
    createProject: Function
}
/**
 * This component is used to organize and display the list of Tasks and their corresponding information and controls.
 * @param {Object} props - Component props object
 * @param {Array<Task>} props.tasksList - The list of all the Tasks in state
 * @param {function(Number,Task):void} props.editTask - Callback function that will be fired when any of the fields of a Task is edited.
 * @param {function(Number):void} props.deleteTask - Callback function that will be fired when any of the delete controls for a Task is triggered.
 * @param {null | CurrentTask} props.currentTask - The current running Task state that represents the current task in the Timer. (The state initializes as null but it should change to CurrentTask after it's mounted)
 * @param {Function} props.setCurrentTask - Callback function that will set the state for the new current running task, set in the Timer.
 * @param {Array<Project>} props.projectsList - The list of existing projects. This is used in the Dropdown component that is used to select a project to assign the task to.
 * @param {function(String):Number} props.createProject - Callback function that will be fired when the form is used to create a new Project.
 */
const PanelTasks = ({ tasksList: givenTasks, editTask, deleteTask, currentTask, setCurrentTask, projectsList, createProject }: Props) => {

    const [mappedTasks, setMappedTasks] = useState<MappedTasksToMilestones>({});
    const currentDate = useRef(new Date());
    const latestHeader = useRef<string>("");

    useEffect(() => {
        if (givenTasks.length < 1) return;
        console.log(`Going to set Mapped Tasks`)
        setMappedTasks(
            mapTasksToMilestone(
                // Pass in the date which the milestones will be calculated around
                currentDate.current,
                // Set the organized tasks to display to an object that has them organized into milestones
                givenTasks.sort((a, b) => { // But first order the list of tasks
                    // Compare the 2 dates
                    if (a.interval.start > b.interval.start) return -1;
                    if (a.interval.start < b.interval.start) return 1;
                    return 0;
                })
            )
        )
    }, [givenTasks])

    const getHeader = (timestamp: number): string =>
        new Date(timestamp).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    const shouldUpdateHeader = (newHeader: string): boolean => {
        if (latestHeader.current === newHeader) return false;
        // This might be an unwanted side effect happening in the JSX rendering, gotta figure out a way to do this better
        latestHeader.current = newHeader;
        return true;
    }

    return (
        <section>
            {Object.keys(mappedTasks).map((milestone: string) =>
                // This represents each one of the separators in the list of tasks
                <>
                    <h3
                        key={mappedTasks[milestone].title}>
                        {mappedTasks[milestone].title}
                    </h3>
                    {
                        mappedTasks[milestone].tasks.map((task: Task) =>
                            <>
                                {
                                    // This is basically: If the (date) header for this task row has already been used before, do not render it
                                    shouldUpdateHeader(getHeader(task.interval.start)) &&
                                    <h5 className="row-task__date-header">{getHeader(task.interval.start)}</h5>
                                }
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
                            </>
                        )
                    }
                </>
            )}
        </section>
    );
}

export default PanelTasks