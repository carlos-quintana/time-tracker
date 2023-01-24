import React, { useState, useEffect } from "react"

export default function App() {
  // Holds the current amount of seconds the timer has counted
  const [seconds, setSeconds] = useState(0)
  // Create an interval when the component is rendered and clear it whenever it's deleted
  useEffect(() => {
    let timerSetInterval = setInterval(() => {
      setSeconds(prevTime => prevTime + 1)
    }, 1000);
    return () => clearInterval(timerSetInterval);
  }, [])

  return (
    <div>
      <h2>Time Tracker application</h2>

      <p>Seconds elapsed: {seconds}</p>
    </div>
  )
}