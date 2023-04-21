import { useState, useEffect, useRef } from "react"
import Popover from "../Shared Components/Popover";
import usePopover from "../../hooks/usePopover";
import { timestampToHMS, HMSToTimestamp, timestampToTimeToDisplay } from "../../helpers/timeFormatting"
import { Interval } from "../../types";

type Props = {
    id: number,
    interval: Interval,
    handleIntervalUpdate: Function,
    intervalPosition: "start" | "end"
}

/**
 * This component will display a time, used for displaying the start and end times for the Tasks. When clicked, this component will allow the user to edit the value with an input of type time.
 * @param {Object} props - Component props object
 * @param {Number} props.id - The id of the Task associated to this component object contained in this row, used when setting the id for the input tag.
 * @param {typedefs.Interval} props.interval - The Interval object of the task, containing its timestamps.
 * @param {function(typedefs.Interval):void} props.handleIntervalUpdate - Callback function that will be fired when the changes are submitted.
 * @param {"start" | "end"} props.intervalPosition - This value tells us what position of the interval this component represents and modify the logic accordingly when submitting. This is so we can use the same component for both the start and end times.
 */
const EditableTime = ({ id, interval: { start, end }, handleIntervalUpdate, intervalPosition }: Props) => {

    /** This will have the timestamp of whichever position was established in the props. */
    const [tempTimestamp, setTempTimestamp] = useState(intervalPosition === "start" ? start : end);
    /** This value controls the conditional rendering for when the component is in editing mode. */
    const [isEditingTime, setIsEditingTime] = useState(false);

    /** Other components also edit on the interval of the task so it is important to keep listening for changes */
    useEffect(() => setTempTimestamp(intervalPosition === "start" ? start : end), [start, end, intervalPosition])

    const handleInputChange = (event: any) => {
        // The input node keeps the value in the format 'H:MM:SS' so we calculate its timestamp, using also the original timestamp which will have the date
        let inputTimestamp = HMSToTimestamp(event.target.value, tempTimestamp)
        setTempTimestamp(inputTimestamp)
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        //      Form Validation
        // This condition is to prevent the HTML time picker component to be cleared and the form submitted
        if (!tempTimestamp) {
            abortSubmit("The time inputted is not valid"); return;
        }
        // Make sure that if both dates happen in the same day, the start time is before the end time (and for more than 1s).
        // If this component is for the start time and the selected time is after the end.
        if (intervalPosition === "start" && tempTimestamp > end) {
            abortSubmit("The starting time cannot be after the end time on the same day"); return;
        }
        // If this component is for the start time and the selected time is within 1 second of the end.
        if (intervalPosition === "start" && tempTimestamp > end - 1000) {
            abortSubmit("The difference must be at least one second"); return;
        }
        // If this component is for the end time and the selected time is before the start.
        if (intervalPosition === "end" && tempTimestamp < start) {
            abortSubmit("The ending time cannot be before the start time on the same day"); return;
        }
        // If this component is for the end time and the selected time is within 1 second of the start.
        if (intervalPosition === "end" && tempTimestamp < start + 1000) {
            abortSubmit("The difference must be at least one second"); return;
        }
        //      Edit Task
        if (intervalPosition === "start")
            handleIntervalUpdate({ start: tempTimestamp, end })
        else
            handleIntervalUpdate({ start, end: tempTimestamp })
        //      Cleanup
        setIsEditingTime(false)
    }

    /**
     * This component has enough different validations and escape conditions that it warrants having a separate function for handling the errors.
     * @param {string} message - The message to display in the alert
     */
    const abortSubmit = (message: string) => {
        popoverErrorMessage.current = message;
        openPopover();
        setTempTimestamp(intervalPosition === "start" ? start : end)
        setIsEditingTime(false)
    }

    /** This is for the error popover that appears when validation fails */
    const { openPopover, closePopover, setRefFocusElement, popoverProps } = usePopover();
    let popoverErrorMessage = useRef("");

    return (
        <>
            {
                isEditingTime ?
                    <form onSubmit={event => handleSubmit(event)}>
                        <input
                            id={`${id}-editTask${intervalPosition === "start" ? "Start" : "End"}Time`}
                            name={`editTask${intervalPosition === "start" ? "Start" : "End"}Time`}
                            className="editable compact"
                            type="time"
                            value={timestampToHMS(tempTimestamp)}
                            onChange={handleInputChange}
                            step="1"
                            autoFocus
                            onBlur={event => handleSubmit(event)}
                            required
                        />
                    </form>
                    :
                    <button
                        className="editable editable-display compact"
                        onClick={() => setIsEditingTime(true)}
                        // @ts-ignore
                        ref={setRefFocusElement}
                    >
                        <span>
                            {timestampToTimeToDisplay(tempTimestamp)}
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

export default EditableTime;