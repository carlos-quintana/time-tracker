
import { CurrentTask } from "../../types";
// Custom made Popover component and hook using React Popper
import usePopover from "../../hooks/usePopover";
import Popover from "../Shared Components/Popover";

type Props = {
    currentTask: CurrentTask | null,
    handleRestart: Function,
    handleDelete: Function,
}

const TaskRowControls = ({ currentTask, handleRestart, handleDelete: deleteTask }: Props) => {

    /** This will set the current Task to a Task with the same details as this one starting from the moment the button is pressed. */
    const handleRestartTask = () => {
        if (currentTask)
            openRestartPopover()
        else
            handleRestart()
    }
    /** This relates to the popover that will appear over the delete button when clicked */
    const {
        isOpenPopover: isOpenDeletePopover,
        openPopover: openDeletePopover,
        closePopover: closeDeletePopover,
        setRefFocusElement: setRefDeleteButton,
        popoverProps: deletePopoverProps,
    } = usePopover();

    const handleClickDeletePopover = () => {
        closeDeletePopover();
        deleteTask()
    }

    /** This relates to the popover that will appear over the delete button when clicked */
    const {
        openPopover: openRestartPopover,
        closePopover: closeRestartPopover,
        setRefFocusElement: setRefRestartButton,
        popoverProps: restartPopoverProps,
    } = usePopover();

    const handleClickRestartPopover = () => {
        closeRestartPopover();
        handleRestart()
    }

    return (
        <>
            {/* Restart this task button */}
            <button
                className="button button-primary"
                onClick={handleRestartTask}
                ref={setRefRestartButton}
            >
                Restart
            </button>
            {/* Restart confirmation popover */}
            <Popover {...restartPopoverProps}>
                <h1 className="popover__title popover__title--warning">Warning</h1>
                <p className="popover__text">There is another task running in the timer. Do you want to cancel it for this one?</p>
                <button
                    className="button"
                    onClick={closeRestartPopover}>
                    Cancel
                </button>
                <button
                    className="button button-warning"
                    onClick={handleClickRestartPopover}>
                    Confirm
                </button>
            </Popover>
            {/* Task delete button */}
            <button
                className={`button button-danger ${isOpenDeletePopover && "button-danger-focus"}`}
                ref={setRefDeleteButton}
                onClick={openDeletePopover}
            >
                Delete
            </button>
            {/* Delete warning popover */}
            <Popover {...deletePopoverProps}>
                <h1 className="popover__title popover__title--danger">Warning</h1>
                <p className="popover__text">Are you sure you want to delete this?</p>
                <button
                    className="button button-danger"
                    onClick={handleClickDeletePopover}>
                    Confirm
                </button>
            </Popover>
        </>
    );
};

export default TaskRowControls;