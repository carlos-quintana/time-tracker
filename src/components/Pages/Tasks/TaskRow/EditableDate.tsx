import { useState, useEffect, useRef } from "react"
import { timestampToDateSnake, dateSnakeToTimestamp, timestampToDateToDisplay } from "../../../../helpers/timeFormatting"
import usePopover from "../../../../hooks/usePopover";
import Popover from "../../../Shared Components/Popover";
import { Interval } from "../../../../types";

type Props = {
    id: number,
    interval: Interval,
    handleIntervalUpdate: Function,
    intervalPosition: "start" | "end"
}

/**
 * This component will display a date, used for displaying the start and end dates for the Tasks. When clicked, this component will allow the user to edit the value with an input of type date.
 * @param {Object} props - Component props object
 * @param {Number} props.id - The id of the Task associated to this component object contained in this row, used when setting the id for the input tag.
 * @param {Interval} props.interval - The Interval object of the task, containing its timestamps.
 * @param {function(Interval):void} props.handleIntervalUpdate - Callback function that will be fired when the changes are submitted.
 * @param {"start" | "end"} props.intervalPosition - This value tells us what position of the interval this component represents and modify the logic accordingly when submitting. This is so we can use the same component for both the start and end dates.
 */
const EditableDate = ({ id, interval: { start, end }, handleIntervalUpdate, intervalPosition }: Props) => {

    /** This will have the timestamp of whichever position was established in the props. */
    const [tempTimestamp, setTempTimestamp] = useState(intervalPosition === "start" ? start : end)
    /** This value controls the conditional rendering for when the component is in editing mode. */
    const [isEditingDate, setIsEditingDate] = useState(false)

    /** Other components also edit on the interval of the task so it is important to keep listening for changes */
    useEffect(() => setTempTimestamp(intervalPosition === "start" ? start : end), [start, end, intervalPosition])

    const handleInputChange = (event: any) => {
        // The input node keeps the value in the format 'YYYY-MM-DD' so we calculate its timestamp, using also the original timestamp which will have the time
        let formattedDate = dateSnakeToTimestamp(event.target.value, tempTimestamp)
        setTempTimestamp(formattedDate)
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()
        //      Form Validation
        // This condition is to prevent the HTML time picker component to be cleared and the form submitted
        if (!tempTimestamp) {
            abortSubmit("The date inputted is not valid"); return;
        }
        // Make sure that if both dates happen in the same day, the start time is before the end time (and for more than 1s).
        // If this component is for the start date and the selected date is after the end.
        if (intervalPosition === "start" && tempTimestamp > end) {
            abortSubmit("The starting date and time cannot be after the end date and time"); return;
        }
        // If this component is for the end date and the selected date is before the start.
        if (intervalPosition === "end" && tempTimestamp < start) {
            abortSubmit("The ending date and time cannot be before the end date and time"); return;
        }

        //      Update Task
        if (intervalPosition === "start")
            handleIntervalUpdate({ start: tempTimestamp, end })
        else
            handleIntervalUpdate({ start, end: tempTimestamp })
        //      Cleanup
        setIsEditingDate(false)
    }

    /**
     * This component has enough different validations and escape conditions that it warrants having a separate function for handling the errors.
     * @param {string} message - The message to display in the alert
     */
    const abortSubmit = (message: string) => {
        popoverErrorMessage.current = message;
        openPopover();
        setTempTimestamp(intervalPosition === "start" ? start : end)
        setIsEditingDate(false)
    }

    /** This is for the error popover that appears when validation fails */
    const { openPopover, closePopover, setRefFocusElement, popoverProps } = usePopover();
    let popoverErrorMessage = useRef("");

    return (
        <>
            {
                isEditingDate ?
                    <form onSubmit={event => handleSubmit(event)}>
                        <input
                            id={`${id}-editTask${intervalPosition === "start" ? "Start" : "End"}Date`}
                            name={`editTask${intervalPosition === "start" ? "Start" : "End"}Date`}
                            className="editable compact"
                            type="date"
                            value={timestampToDateSnake(tempTimestamp)}
                            onChange={handleInputChange}
                            min={intervalPosition === "start" ? undefined : timestampToDateSnake(start)}
                            max={intervalPosition === "end" ? undefined : timestampToDateSnake(end)}
                            autoFocus
                            onBlur={event => handleSubmit(event)}
                        />
                    </form>
                    :
                    <button
                        className="editable editable-display compact"
                        onClick={() => setIsEditingDate(true)}
                        ref={setRefFocusElement}
                    >
                        <span>
                            {timestampToDateToDisplay(tempTimestamp)}
                        </span>
                    </button>
            }
            <Popover {...popoverProps}>
                <h1 className="popover__title popover__title--danger">Error</h1>
                <p className="popover__text">{popoverErrorMessage.current}</p>
                <button className="button" onClick={closePopover}>Okay</button>
            </Popover >
        </>
    )
}

export default EditableDate;