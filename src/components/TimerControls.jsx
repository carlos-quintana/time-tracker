const TimerControls = ({ timerStatus, startTimer, stopTimer, resetTimer }) => {
    return (
        <div>
            {/* Timer Controls */}
            {timerStatus === "reset" && <button onClick={startTimer}>
                Start
            </button>}
            {timerStatus === "running" && <button onClick={stopTimer}>
                Stop
            </button>}
            {timerStatus === "stopped" && <button onClick={resetTimer}>
                Reset
            </button>}
        </div>
    );
}

export default TimerControls