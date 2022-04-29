import { useEffect, useState } from 'react'

export default function Timer() {

    const [currentCount, setCurrentCount] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);

    useEffect(() => {
        let intervalTimer = null;
        if (isTimerActive)
            intervalTimer = setInterval(() => {
                setCurrentCount(prevTime => prevTime+10)
            }, 10)
        else clearInterval(intervalTimer)
        return () => clearInterval(intervalTimer);
    }, [isTimerActive])

    return (
        <>
            <p>{currentCount}</p>
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