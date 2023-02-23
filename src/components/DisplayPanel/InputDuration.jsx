import React, { useEffect, useRef, useState } from "react"
import { secondsToFormattedHMS } from "../../helpers/timeFormatting"

/**
 * TODO: Move the function to another file and write its respective tests
 * This function will receive a String and change a character located in a given position
 * @param {String} string - The string to make the changes on
 * @param {Number} position - The index of the character to replace
 * @param {String} character - The character to replace
 * @returns {String} The String with the character selected replaced.
 * @example replaceCharacter("abcde", 2, "x")
 * "abxde"
 */
const replaceCharacter = (string, position, character) => string.substring(0, position) + character + string.substring(position + 1)

/** This component will create an input element of type text, which we will control the position of the caret (cursor) and the values that are inputed, so that it always represents a valid time in the form of H:MM:SS, including the colon signs.
 * To keep track of the position of the caret we will use the input properties of selectionStart and selectionEnd, and we will use the event onKeyDown to receive the numeric inputs from the user and handle them appropriately, and the logic that comes with the constrainst of the format, for example, that seconds and minutes are 2 digits numbers and cannot be larger than 59, etc. 
 * @param {Object} props - Component props object
 * @param {Number} props.id - The id of the Task associated to this component object contained in this row, used when setting the id for the input tag.
 * @param {Number} props.durationSeconds - The total duration of seconds to first display.
 * @param {function(String):void} props.handleSubmit - Callback function that will be fired when the changes are submitted.
 */
const InputDuration = ({ id, durationSeconds, handleSubmit }) => {
    // This will be in the form of a formatted H:MM:SS string to be displayed
    const [durationString, setDurationString] = useState(null)
    // This points to the element of the input, so that we can access it's selectionStart and End properties to manually select and keep track of the position of the real caret abd the position that will be updated when the corresponding keystroke comes.
    const inputRef = useRef(null)
    // selectionPosition will keep track of the character that the user can edit next, and this character will be highlighted at all times. We will also use this value to calculate the position of an imaginary pointer which will work the same way but backwards, so that we can know when the user goes through the position of the seconds, the minutes, the hours and both of the colon simbols ':', by substracting the length of the string and this pointer. The reason we work backwards is because the value of hours, which goes at the start of the string, can be arbitrary, as an interval can have 1 hour '1:mm:ss' or 100 hours '100:mm:ss'. On the other hand, the last parts of the string remain very consisten, as all intervals can only have 2 digits for the minutes and the seconds.
    const [caretPosition, setCaretPosition] = useState(-1)
    // This variable is used to detect when an alternative input method is being used, one that would not work with the keydown event that the input is using, namely Android default keyboards. /TODO/ This can be used to activate an alternative behavior to still capture the inputs.
    const [isComposing, setIsComposing] = useState(false);

    useEffect(() => {
        const onCompositionStart = () => setIsComposing(true);
        const onCompositionEnd = () => setIsComposing(false);
        document.addEventListener('compositionstart', onCompositionStart);
        document.addEventListener('compositionend', onCompositionEnd);
        return () => {
            document.removeEventListener('compositionstart', onCompositionStart);
            document.removeEventListener('compositionend', onCompositionEnd);
        };
    }, []);

    // Put the selection at the start of the input whenever the component is created
    useEffect(() => {
        setDurationString(secondsToFormattedHMS(durationSeconds))
        setCaretPosition(0);
    }, [durationSeconds])

    useEffect(() => {
        if (durationString) {
            inputRef.current.selectionStart = caretPosition
            inputRef.current.selectionEnd = caretPosition + 1
        }
        console.log(`durationString.length - selectionPosition ${durationString?.length - caretPosition || -1}`)
    }, [caretPosition, durationString])

    const handleOnChange = event => { }

    const handleKeyDown = event => {
        if (isComposing) return;
        console.log(`~ Received a key down event for key ${event.key}`)

        event.preventDefault(); // event.stopPropagation();

        // Handle movement operations
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            console.log(" < < < Pressed Arrow Left")
            if (caretPosition !== 0) // If we're at the start of the input there's no need to move left
                setCaretPosition(caretPosition - 1)
        }

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            console.log(" > > > Pressed Arrow Right")
            if (caretPosition !== durationString.length - 1) // Unless we're at the end of the input there's no need to move right
                setCaretPosition(caretPosition + 1)
        }

        // Handle input processing
        const VALID_INPUT_NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        if (VALID_INPUT_NUMBERS.indexOf(event.key) !== -1) {

            // These are the positions for the tens of the minutes and seconds, which means they cannot be larger than 5
            if (((durationString.length - caretPosition) === 2 || (durationString.length - caretPosition) === 5)
                && ["6", "7", "8", "9"].indexOf(event.key) !== -1)
                return // Do nothing

            // These are the positions for the ':' so will use a flag variable, where if the user types something in the position of the colon the program will skip one position and input that value in the next available one. 
            let skipFlag = 0;
            if ((durationString.length - caretPosition) === 3 || (durationString.length - caretPosition) === 6) {
                if (["6", "7", "8", "9"].indexOf(event.key) !== -1) {
                    setCaretPosition(caretPosition + 1)
                    return
                }
                else
                    // However if the number inputted breaks the rule of the tens place in the seconds and minutes (is 6, 7, 8 or 9) then the user will be sent to the position after the colon and remain there until they input a valid digit
                    skipFlag = 1
            }

            // Here's where we change the HMS value, having the position of the caret and the input the user gave
            let tempDurationString = replaceCharacter(durationString, caretPosition + skipFlag, event.key)
            setDurationString(tempDurationString)

            if (caretPosition !== durationString.length - 1)
                setCaretPosition(caretPosition + 1 + skipFlag)
            skipFlag = 0

            console.log(`The new tempDuration would be: ${tempDurationString}`)
        }

        if (["Escape", "Enter"].indexOf(event.key) !== -1) {
            handleCloseInput(event)
            console.log(`Closing on key ${event.key}`)
        }
    }

    const handlePositionUpdate = event => {
        if (inputRef.current.selectionStart === event.target.value.length) { // If we're at the end of the input take a step back
            setCaretPosition(inputRef.current.selectionStart - 1)
            // There is a scenario where if the user clicks on the exact same spot more than once, the position will not be highlighted.
            // The event onMouseDown and onSelect trigger in a way that they override the selected range, and since the state did not update because the user clicked the same spot (and therefore the value is the same), the useEffect which updates the highlighted range won't trigger. Because of this we update it manually here.
            if (caretPosition === inputRef.current.selectionStart - 1) {
                inputRef.current.selectionStart = caretPosition
                inputRef.current.selectionEnd = caretPosition + 1
            }
        } else {
            setCaretPosition(inputRef.current.selectionStart)
            if (caretPosition === inputRef.current.selectionStart) {
                inputRef.current.selectionStart = caretPosition
                inputRef.current.selectionEnd = caretPosition + 1
            }
        }
    }

    const handleCloseInput = event => handleSubmit(event)

    return (
        <>
            <input
                id={`${id}-editTaskDuration`}
                name="editTaskDuration"
                className="editable"
                type="text"
                // inputmode="numeric"
                value={durationString ? durationString : ""}
                onChange={handleOnChange}

                /*All of these events can potentially update the position of the caret*/
                onKeyDown={handleKeyDown}
                onMouseDown={handlePositionUpdate}
                onInput={handlePositionUpdate}
                onSelect={handlePositionUpdate}
                onTouchStart={handlePositionUpdate}


                onPaste={e => e.preventDefault}
                onCut={e => e.preventDefault}

                autoFocus
                /** Since we are controlling the input there's no reason it shouldn't be valid when the input loses focus */
                onBlur={handleCloseInput}
                ref={inputRef}
            />
        </>
    )

}

export default InputDuration;