export default function TimerControls({timerStatus, setTimerStatus, taskSubmitTrigger}) {

    if (timerStatus === "initial") {
        return (
            <button onClick={() => setTimerStatus("running") }>
                Start
            </button>
        );
    }
    if (timerStatus === "stopped") {
        return (
            <>
                <button onClick={() => { console.log("Submit button pressed"); taskSubmitTrigger(); }}>
                    Submit
                </button>
                <button onClick={() => setTimerStatus("running") }>
                    Resume
                </button>
                <button onClick={() => setTimerStatus("initial") }>
                    Reset
                </button>
            </>
        );
    }

    return (
        <button onClick={() => setTimerStatus("stopped")}>
            Stop
        </button>
    );
}
