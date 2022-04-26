import { useEffect, useState } from 'react'

export default function Timer() {

    const [currentCount, setCurrentCount] = useState(0);

    useEffect(() => {
        console.log("Inside use effect")
        let intervalTimer = setInterval(() => {
            setCurrentCount(prevTime => {
                              console.log(`Inside the interval with a count of ${prevTime}`);
                              return prevTime + 1;
                           })
        }, 1000)
        return () => clearInterval(intervalTimer);
    }, [])

    return (<p>{currentCount}</p>);
}