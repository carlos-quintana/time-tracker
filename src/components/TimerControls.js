export default function TimerControls({timerStatus, setTimerStatus}) {

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
                <button onClick={() => { alert("Submit button pressed") }}>
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
