import { useEffect, useState } from 'react'

export default function Timer() {

    const [currentCount, setCurrentCount] = useState(0);

    useEffect(() => {
        let intervalTimer = setInterval(() => 
            setCurrentCount(prevTime => prevTime + 1)
        , 1000)
        return () => clearInterval(intervalTimer);
    }, [])

    return (<p>{currentCount}</p>);
}