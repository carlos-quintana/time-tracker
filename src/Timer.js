import { useEffect, useState } from 'react'

export default function Timer() {

    const [currentCount, setCurrentCount] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);

    function formatTime(secondsCount) {
        let hours = Math.floor(secondsCount / 3600);
        let minutes = Math.floor(secondsCount / 60) % 60;
        let seconds = secondsCount % 60;
        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${hours}:${minutes}:${seconds}`
    }

    useEffect(() => {
        let intervalTimer = null;
        if (isTimerActive)
            intervalTimer = setInterval(() => {
                setCurrentCount(prevTime => prevTime + 1)
            }, 1000)
        else clearInterval(intervalTimer)
        return () => clearInterval(intervalTimer);
    }, [isTimerActive])

    return (
        <>
            <p>{formatTime(currentCount)}</p>
            <button onClick={() => setIsTimerActive(true)}>
                Start
            </button>
            <button onClick={() => setIsTimerActive(false)}>
                Pause
            </button>
            <button onClick={() => { setCurrentCount(0); setIsTimerActive(false) }}>
                Reset
            </button>
        </>
    );
}