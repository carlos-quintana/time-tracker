import React, { useState } from "react"
import DropdownSearch from "../Shared Components/DropdownSearch"


const InputCustomInterval = ({ handleSubmit: handleEntrySubmit, projectsList, createProject }) => {

    const [taskName, setEntryName] = useState("")
    const [taskProject, setTaskProject] = useState(null)
    const [dropdownResetTrigger, setDropdownResetTrigger] = useState(0)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")

    const handleProjectCreation = newProjectName => {
        let newProjectID = createProject(newProjectName)
        return newProjectID
    }

    const handleFormSubmit = event => {
        event.preventDefault();

        // console.log(startDate, startTime, endDate, endTime)
        // Validation empty fields
        if (!(startDate && startTime && endDate && endTime)) {
            alert("Please fill in all of the fields")
            return
        }
        let startTimestamp = new Date(startDate + " " + startTime).getTime();
        let endTimestamp = new Date(endDate + " " + endTime).getTime();

        if (startTimestamp >= endTimestamp) {
            alert("The times selected are not valid") // TODO: A better notifications system (maybe modals or tooltips)
            return
        }
        console.log(`Submitting new task with the name "${taskName}", starterTimestamp: ${startTimestamp}, endTimestamp:${endTimestamp}, taskProject:${taskProject}`)
        handleEntrySubmit(taskName, { start: startTimestamp, end: endTimestamp}, taskProject || undefined )
        setEntryName("");
        setStartDate("");
        setEndDate("");
        setStartTime("");
        setEndTime("");
        setTaskProject(null); // The state in the panel for which project is selected
        setDropdownResetTrigger(dropdownResetTrigger+1) // Trigger a useEffect hook in the child component to change state
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


                {/* Task project */}
                <div>
                    <DropdownSearch
                        buttonText={"Add a project"}
                        searchPlaceholderText={"Search a project or create a new one"}
                        optionsList={projectsList}
                        initialSelection={null}
                        onCreateCallback={handleProjectCreation}
                        onSelectCallback={setTaskProject}
                        resetTrigger={dropdownResetTrigger}
                    />
                </div>

                <input type="submit"
                    value="Submit"
                    disabled={taskName.trim() === ""} />
            </form>
        </div>
    )
}

export default InputCustomInterval