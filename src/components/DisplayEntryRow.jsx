// import React, { useEffect, useState } from "react"
import DisplayEntryName from "./DisplayEntryName"
import DisplayEntryDuration from "./DisplayEntryDuration"
import DisplayEntryDate from "./DisplayEntryDate"
import DisplayEntryTime from "./DisplayEntryTime"

const DisplayEntryRow = ({ entry, editEntry, deleteEntry }) => {

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
                <button disabled>
                    Editar intervalo
                </button>
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
                disabled={false}>
                Delete
            </button>
        </div>
    );
}

export default DisplayEntryRow