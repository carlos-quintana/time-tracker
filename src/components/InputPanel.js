import TimerDisplay from "./TimerDisplay"
import TimerControls from "./TimerControls"
import { useState, useEffect } from "react";

export default function InputPanel({ entriesList, setEntriesList }) {

    const [taskDescription, setTaskDescription] = useState("")
    const [submittingTask, setSubmittingTask] = useState(false);
    const [currentSeconds, setCurrentSeconds] = useState(0);
    const [timerStatus, setTimerStatus] = useState("initial");
    // This should be 1000 (1 second) but can ve varied for debugging purpouses
    const INTERVAL_MS_SPEED = 10;
    // This should be 1 (1 second) but can ve varied for debugging purpouses
    const SECONDS_COUNT_INCREASE = 1;

    // The useEffect that starts and stops the timer
    useEffect(() => {
        console.log("Inside use effect, timerStatus: ", timerStatus);
        let intervalTimer = null;
        if (timerStatus === "running")
            intervalTimer = setInterval(() => {
                setCurrentSeconds(prevTime => prevTime + SECONDS_COUNT_INCREASE)
            }, INTERVAL_MS_SPEED);
        else
            clearInterval(intervalTimer);

        if (timerStatus === "initial")
            setCurrentSeconds(0);

        return () => clearInterval(intervalTimer);
    }, [timerStatus]);

    // The useEffect that submits the current task
    useEffect(() => {
        console.log("Inside submittingTask hook", submittingTask)
        if (submittingTask) {
            const taskSecondsCount = currentSeconds;
            if (isEntryValid(taskDescription, taskSecondsCount)) {
                const newEntry = {
                    id: (entriesList.length + 1),
                    description: taskDescription,
                    secondsCount: taskSecondsCount,
                }
                console.log("Submitting the task", newEntry)
                setEntriesList([...entriesList, newEntry])
                setCurrentSeconds(0);
                setTimerStatus("initial");
                setTaskDescription("");
            } else {
                console.log("The task isn't valid")
                // Handle the error by preventing the submission and informing the user
            }
            setSubmittingTask(false);
        }
    }, [submittingTask])

    return (
        <div className="input-panel">
            <div className="input-area">
                <input
                    id="task-input"
                    className="task-input"
                    type="text"
                    placeholder="Input a new task"
                    value={taskDescription}
                    onChange={event => setTaskDescription(event.target.value)}
                />
            <TimerControls
                timerStatus={timerStatus}
                setTimerStatus={status => setTimerStatus(status)}
                taskSubmitTrigger={_ => setSubmittingTask(true)}
            />
            </div>
        </div>
    );
}

function isEntryValid(taskDescription, taskSecondsCount) {
    if (taskDescription === "") return false;
    if (taskSecondsCount < 1) return false;
    return true;
}