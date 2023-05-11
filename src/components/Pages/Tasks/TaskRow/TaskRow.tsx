import { CurrentTask, Interval, Project, Task } from "../../../../types"

import DropdownSearch from "../../../Shared Components/DropdownSearch"
import EditableName from "./EditableName"
import EditableDate from "./EditableDate"
import EditableTime from "./EditableTime"
import EditableDuration from "./EditableDuration"
import TaskRowControls from "./TaskRowControls"
// Material Icons
import TodayIcon from '@mui/icons-material/Today';
import EventIcon from '@mui/icons-material/Event';
import RemoveIcon from '@mui/icons-material/Remove';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';

type Props = {
    task: Task,
    editTask: Function,
    deleteTask: Function,
    currentTask: CurrentTask | null,
    setCurrentTask: Function,
    projectsList: Project[],
    createProject: Function
}

/**
 * This component contains all the data of the Tasks that will be displayed and also the controls to edit the different fields, as well as the controls to delete the Task or create a new Task in the timer with the same data (restart the Task).
 * @param {Object} props - Component props object
 * @param {Task} props.task - The Task object contained in this row.
 * @param {function(Number,Task):void} props.editTask - Callback function that will be fired when any of the fields of a Task is edited.
 * @param {function():void} props.deleteTask - Callback function that will be fired when the delete controls of the Task are triggered.
 * @param {null | CurrentTask} props.currentTask - The current running Task state that represents the current task in the Timer. (The state initializes as null but it should change to CurrentTask after it's mounted). This is used to check if there's a Current Task running at the moment.
 * @param {Function} props.setCurrentTask - Callback function that will set the state for the new current running task when the restart control is triggered.
 * @param {Array<Project>} props.projectsList - The list of existing projects. This is used in the Dropdown component that is used to select a project to assign the task to.
 * @param {function(String):Number} props.createProject - Callback function that will be fired when the form is used to create a new Project.
 */
const TaskRow = ({ task, editTask, deleteTask, currentTask, setCurrentTask, projectsList, createProject }: Props) => {

    /** @param {String} newName - The new name for the Task. */
    const handleNameUpdate = (newName: string) => {
        editTask(task.id, { ...task, name: newName })
    }

    /** @param {null | Number} newProjectID - The id for the project to assign to this task. If a null value is passed then the project is removed. */
    const handleProjectUpdate = (newProjectID: number) => {
        if (newProjectID !== null)
            editTask(task.id, { ...task, project: newProjectID })
        else
            editTask(task.id, { ...task, project: undefined })
    }

    /**  This function is used when a project is created in the Dropdown component.
     * @param {String} newProjectName - The name for the new project.
     * @returns {Number} - The id of the newly created project */
    const handleProjectCreation = (newProjectName: string): number => {
        let newProjectID = createProject(newProjectName)
        handleProjectUpdate(newProjectID)
        return newProjectID
    }

    /** This method can be triggered from different components inside of this row, such as the Date, Time and Duration components.
     *  @param {Interval} newInterval - The new Interval object to assign to the task */
    const handleIntervalUpdate = (newInterval: Interval) =>
        editTask(task.id, { ...task, interval: newInterval })

    /** This will set the current Task to a Task with the same details as this one starting from the moment the button is pressed. */
    const restartTask = () => {
        setCurrentTask({ name: task.name, start: Date.now(), project: task.project });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="task-row">
            {/* Task id */}
            <span className="task-row__id">{task.id}</span>
            <div className="task-row__name-project">
                {/* Task name */}
                <div className="task-row__name-container">
                    <EditableName
                        id={task.id}
                        name={task.name}
                        handleNameUpdate={handleNameUpdate}
                    />
                </div>
                {/* Task project */}
                <div className="task-row__project-container">
                    <DropdownSearch
                        defaultText={"Assign a project"}
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
            </div>
            <div className="task-row__separator">&nbsp;</div>
            {/* Task start and end datetimes */}
            <div className="task-row__interval-container">
                {/* <div className="start-interval-container"> */}
                <div className="task-row__inner-interval-container">
                    <span className="mui-icon" title="Start date"><TodayIcon /></span>
                    <span className="task-row__interval-label">Start:</span>
                    <div className="task-row__date-container">
                        <EditableDate
                            id={task.id}
                            interval={task.interval}
                            handleIntervalUpdate={handleIntervalUpdate}
                            intervalPosition="start"
                        />
                    </div>
                    <div className="task-row__time-container">
                        <EditableTime
                            id={task.id}
                            interval={task.interval}
                            handleIntervalUpdate={handleIntervalUpdate}
                            intervalPosition="start"
                        />
                    </div>
                </div>
                <span className="mui-icon task-row__hyphen" title="End date"><RemoveIcon /></span>
                <div className="task-row__inner-interval-container">
                    <span className="mui-icon" title="End date"><EventIcon /></span>
                    <span className="task-row__interval-label">End:</span>
                    <div className="task-row__date-container">
                        <EditableDate
                            id={task.id}
                            interval={task.interval}
                            handleIntervalUpdate={handleIntervalUpdate}
                            intervalPosition="end"
                        />
                    </div>
                    <div className="task-row__time-container">
                        <EditableTime
                            id={task.id}
                            interval={task.interval}
                            handleIntervalUpdate={handleIntervalUpdate}
                            intervalPosition="end"
                        />
                    </div>
                </div>
            </div>
            {/* TODO: Find a more suitable name */}
            <div className="task-row__remaining-fields">
                {/* Task duration */}
                <div className="task-row__duration-container">
                    <span className="mui-icon" title="Duration"><TimerOutlinedIcon /></span>
                    <EditableDuration
                        id={task.id}
                        interval={task.interval}
                        handleIntervalUpdate={handleIntervalUpdate}
                    />
                </div>
                {/* Controls */}
                <div className="task-row__controls">
                    <TaskRowControls
                        currentTask={currentTask}
                        handleRestart={restartTask}
                        handleDelete={deleteTask}
                    />
                </div>
            </div>
        </div>
    );
}

export default TaskRow;