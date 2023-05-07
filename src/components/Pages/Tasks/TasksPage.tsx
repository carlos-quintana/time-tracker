import { CurrentTask, Project, Task } from "../../../types";
import PanelInputs from "./InputPanel/PanelInputs";
import TasksList from "./TasksList";

type Props = {
    tasksList: Task[],
    createNewTask: Function,
    editTask: Function,
    deleteTask: Function,
    currentTask: CurrentTask | null,
    setCurrentTask: Function,
    projectsList: Project[],
    createProject: Function
}

const TasksPage = ({ tasksList, createNewTask, editTask, deleteTask, currentTask, setCurrentTask, projectsList, createProject }: Props) => {
    return (
        <>
            <PanelInputs
                createNewTask={createNewTask}
                currentTask={currentTask} setCurrentTask={setCurrentTask}
                projectsList={projectsList} createProject={createProject}

            />
            <TasksList
                tasksList={tasksList} editTask={editTask} deleteTask={deleteTask}
                currentTask={currentTask} setCurrentTask={setCurrentTask}
                projectsList={projectsList} createProject={createProject}
            />
        </>
    )
}

export default TasksPage;