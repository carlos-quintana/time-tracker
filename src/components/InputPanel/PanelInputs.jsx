import React, { useState } from "react"
import PanelInputTimer from "./PanelInputTimer"
import PanelInputInterval from "./PanelInputInterval"

const PanelInputs = ({ createNewTask, currentRunningTask, setCurrentRunningTask }) => {

    const [inputMethod, setInputMethod] = useState("timer")

    const handleNewTaskSubmitted = (taskName, interval) => {
        // TODO
        createNewTask(taskName, interval)
    }

    return (
        <div>
            <form name="inputTypeSelector" onChange={event => setInputMethod(event.target.value)}>
                <input type="radio" name="inputSelector" id="inputSelectorTimer" value="timer" defaultChecked/>
                <label htmlFor="inputSelectorTimer">Timer</label>
                <input type="radio" name="inputSelector" id="inputSelectorCustom" value="custon"/>
                <label htmlFor="inputSelectorCustom">Custom dates and time</label>
            </form>
            {
                inputMethod === "timer" ?
                    <PanelInputTimer
                        handleSubmit={handleNewTaskSubmitted}
                        currentRunningTask={currentRunningTask}
                        setCurrentRunningTask={setCurrentRunningTask}
                    />
                    :
                    <PanelInputInterval
                        handleSubmit={handleNewTaskSubmitted}
                    />
            }
        </div>
    )
}
export default PanelInputs