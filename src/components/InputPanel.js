import TimerDisplay from "./TimerDisplay"
import TimerControls from "./TimerControls"
import { useState, useEffect } from "react";

export default function InputPanel() {

    const [currentSeconds, setCurrentSeconds] = useState(0);
    const [timerStatus, setTimerStatus] = useState("initial");
    // This should be 1000 (1 second) but can ve varied for debugging purpouses
    const INTERVAL_MS_SPEED = 10;
    // This should be 1 (1 second) but can ve varied for debugging purpouses
    const SECONDS_COUNT_INCREASE = 1;

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

    return (
        <>
            <h2>Time tracker input panel:</h2>
            <form>
                <input
                    type="text"
                    placeholder="Input a new task" />
            </form>
            <TimerDisplay
                currentSecondsCount={currentSeconds} />
            <TimerControls
                timerStatus={timerStatus}
                setTimerStatus={status => setTimerStatus(status)} />
        </>
    );
}