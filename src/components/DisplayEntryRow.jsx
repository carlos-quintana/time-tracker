// import React, { useEffect, useState } from "react"
import DisplayEntryName from "./DisplayEntryName"
import DisplayEntryDuration from "./DisplayEntryDuration"
import DisplayEntryDate from "./DisplayEntryDate"
import DisplayEntryTime from "./DisplayEntryTime"

const DisplayEntryRow = ({ entry, editEntry, deleteEntry, currentRunningTask, setCurrentRunningTask }) => {

    const handleNameUpdate = newName => {
        console.log(`Updating the name of the entry ${entry.id},
                     previous name ${entry.name}, new name ${newName}`)
        editEntry(entry.id, { ...entry, name: newName })
    }

    const handleIntervalUpdate = newInterval => {
        console.log(`Updating the interval of the entry ${entry.id}, 
                     previous interval ${entry.interval.start}-${entry.interval.end}, 
                     new interval ${newInterval.start}-${newInterval.end}`)
        editEntry(entry.id, { ...entry, interval: newInterval })
    }

    const handleDeleteEntry = () => deleteEntry(entry.id)

    const handleRestartEntry = () => {
        if (currentRunningTask) 
            alert("There is an active task currently running in the timer. To restart this task please stop the active task")  // <- Change for a modal in the future
         else 
         setCurrentRunningTask({ name: entry.name, starterTimestamp: Date.now() })
    }

    return (
        <div>
            {/* Entry id */}
            {entry.id}
            {/* Entry name */}
            <div>
                <DisplayEntryName
                    id={entry.id}
                    name={entry.name}
                    handleNameUpdate={handleNameUpdate}
                />
            </div>
            {/* Entry start and end datetimes */}
            <div>
                {(new Date(entry.interval.start)).toLocaleString()} - {(new Date(entry.interval.end)).toLocaleString()}
            </div>
            <div>
                <DisplayEntryDate
                    id={entry.id}
                    interval={entry.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="start"
                />
            </div>
            <div>
                <DisplayEntryTime
                    id={entry.id}
                    interval={entry.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="start"
                />
            </div>
            <div>
                <DisplayEntryDate
                    id={entry.id}
                    interval={entry.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="end"
                />
            </div>
            <div>
                <DisplayEntryTime
                    id={entry.id}
                    interval={entry.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                    intervalPosition="end"
                />
            </div>
            {/* Entry duration */}
            <div>
                <DisplayEntryDuration
                    id={entry.id}
                    interval={entry.interval}
                    handleIntervalUpdate={handleIntervalUpdate}
                />
            </div>
            {/* Entry delete button */}
            <button
                onClick={() => handleDeleteEntry()}
                disabled={false}
            >
                Delete
            </button>
            {/* Restart this entry button */}
            <button
                onClick={handleRestartEntry}
                // disabled={currentRunningTask}
            >
                Restart this task
            </button>
        </div>
    );
}

export default DisplayEntryRow