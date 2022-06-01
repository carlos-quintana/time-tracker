export default function TimerControls({ timerStatus, setTimerStatus, taskSubmitTrigger }) {

    if (timerStatus === "initial") {
        return (
            <button
                className="button btn-primary"
                onClick={() => setTimerStatus("running")}
            >
                Start
            </button>
        );
    }
    if (timerStatus === "stopped") {
        return (
            <>
                <button
                    className="button"
                    onClick={() => setTimerStatus("running")}
                >
                    Resume
                </button>
                <button
                    className="button btn-yellow"
                    onClick={() => setTimerStatus("initial")}
                >
                    Reset
                </button>
                <button
                    className="button btn-primary"
                    onClick={() => { console.log("Submit button pressed"); taskSubmitTrigger(); }}
                >
                    Submit
                </button>
            </>
        );
    }

    return (
        <button
            className="button btn-red"
            onClick={() => setTimerStatus("stopped")}
        >
            Stop
        </button>
    );
}
