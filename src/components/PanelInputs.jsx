import React, { useState } from "react"
import InputCustomInterval from "./InputCustomInterval"
import InputTimer from "./InputTimer"

const PanelInputs = ({ createNewEntry }) => {

    const [inputMethod, setInputMethod] = useState("timer")

    const handleNewEntrySubmitted = (entryName, interval) => {
        // TODO
        createNewEntry(entryName, interval)
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
                    <InputTimer
                        handleSubmit={handleNewEntrySubmitted}
                    />
                    :
                    <InputCustomInterval
                        handleSubmit={handleNewEntrySubmitted}
                    />
            }
        </div>
    )
}
export default PanelInputs