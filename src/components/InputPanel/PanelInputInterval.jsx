import React, { useState } from "react"

const InputCustomInterval = ({ handleSubmit: handleEntrySubmit }) => {

    const [taskName, setEntryName] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")

    const handleFormSubmit = event => {
        event.preventDefault();

        // console.log(startDate, startTime, endDate, endTime)
        // Validation empty fields
        if (!(startDate && startTime && endDate && endTime))
            alert("Please fill in all of the fields")

        let startTimestamp = new Date(startDate + " " + startTime).getTime();
        let endTimestamp = new Date(endDate + " " + endTime).getTime();

        if (startTimestamp >= endTimestamp) {
            alert("The times selected are not valid") // TODO: A better notifications system (maybe modals or tooltips)
            return
        }
        // console.log(`Submitting new task with the name "${taskName}", starterTimestamp: ${startTimestamp}, endTimestamp:${endTimestamp}`)
        handleEntrySubmit(taskName, { start: startTimestamp, end: endTimestamp })
        setEntryName("");
    }

    return (
        <div>
            <p>Input the custom dates and times for the new task:</p>
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="taskName">Name of the task: </label>
                <input id="taskName"
                    name="taskName"
                    type="text"
                    value={taskName}
                    onChange={event => setEntryName(event.target.value)}
                    placeholder="Input what you're working on" />

                <label htmlFor="startDate">Start: </label>
                <input id="startDate"
                    name="startDate"
                    type="date"
                    value={startDate}
                    max={endDate ? endDate : undefined}
                    onChange={event => setStartDate(event.target.value)} />
                <input id="startTime"
                    name="startTime"
                    type="time"
                    value={startTime}
                    onChange={event => setStartTime(event.target.value)} />

                <label htmlFor="endDate">End: </label>
                <input id="endDate"
                    name="endDate"
                    type="date"
                    value={endDate}
                    min={startDate ? startDate : undefined}
                    onChange={event => setEndDate(event.target.value)} />
                <input id="endTime"
                    name="endTime"
                    type="time"
                    value={endTime}
                    onChange={event => setEndTime(event.target.value)} />

                <input type="submit"
                    value="Submit"
                    disabled={taskName.trim() === ""} />
            </form>
        </div>
    )
}

export default InputCustomInterval