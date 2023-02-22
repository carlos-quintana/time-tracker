import React, { useEffect, useRef, useState } from "react";

/**
 * This component will act as a select dropdown input field, where the user can click on it to expand a menu listing all of the different options, and when clicking on any of these options it will change the state of the component to the selected option. 
 * This component has the ability to search and filter for a specific string to find an option more easily.
 * This component will also have the feature to create a new option when using the search field and not finding an exact match.
 * @param {Object} props - Component props object
 * @param {String} [props.defaultText] - This is the text the component will display when there is no option selected. If none is provided the default text will be "Click to select an option"
 * @param {String} [props.searchPlaceholder] - This is the text the component will display in the input field for searching options. If none is provided the default text will be "Search for an option"
 * @param {Array<{id:Number,value:string}>} props.optionsList - The list of options the component will provide.
 * @param {null | Number} [props.initialSelection=null] - If provided a number, the component will have the option selected which id is equal to this value. Otherwise none will be selected.
 * @param {function(null|Number):void} props.onSelectCallback - A callback function that will be triggered when the user selects an option, it will receive the id of the option selected (or null if none is).
 * @param {function(String):Number} props.onCreateCallback - A callback function that will be triggered when the user creates an option, it will receive the name of the option and return the id for it. It was designed this way based on the specific logif of this project.
 * @param {Number} [props.resetTrigger=0] - This is a prop that will be used to trigger a useEffect hook from an outside component so that the option can be set back to null and effectively reset the selection. It has a default value of 0, so that the first render doesn't execute the reset value (and overwrite the initialSelection).
 */
const DropdownSearch = ({
    defaultText = "Click to select an option",
    searchPlaceholder = "Search for an option",
    optionsList: options,
    initialSelection = null,
    onSelectCallback,
    onCreateCallback,
    resetTrigger = 0 }) => {

    /** This variable holds the numeric id of the option that's currently selected, or 'null' if no option is selected. */
    const [selection, setSelection] = useState(
        /** @type {number|null} */(null));

    /** This variable controls the conditional rendering for when the dropodown opens. */
    const [isOpen, setIsOpen] = useState(false);

    /** This variable controls the search input field. */
    const [searchText, setSearchText] = useState("");

    /** This variable contains the list of options to display in the dropdown component. */
    const [optionsList, setOptionsList] = useState(
        /** @type {Array<{id:Number,value:string}>} */([]));

    /** With this ref we'll be able to add a Listener to the document to know when the user clicks outside of the dropdown and close it */
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (isOpen)
                // @ts-ignore the DOM element.contains gives a linter error
                if (dropdownRef.current && !dropdownRef.current.contains(event.target))
                    setIsOpen(false)
        }
        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    /** 
     * On the first render assign the initial selection. 
     * Whenever the initial Selection changes update this components selection. There was a particular bug where when deleting rows of tasks, the dropdowns wouldn't update. 
     */
    useEffect(() => {
        // console.log("> Inside of initialSelection useEffect inside of dropdown")
        // console.log({ initialSelection })
        setSelection(initialSelection)
        // console.log("< Outside of initialSelection useEffect inside of dropdown")
    }, [initialSelection])

    useEffect(() => {
        // console.log("> Inside of searchText useEffect inside of dropdown")
        // console.log({ options })
        // console.log({ optionsList })
        if (searchText.trim() === "") {
            // console.log('Setting options === ""')
            setOptionsList(options)
        } else {
            // console.log('Setting options filter')
            setOptionsList(
                options.filter(option =>
                    option.value.toLowerCase()
                        .includes(searchText.trim().toLowerCase())))
        }
        // console.log("< Outside of searchText useEffect inside of dropdown")
    }, [searchText])

    useEffect(() => {
        // console.log("> Inside of options useEffect inside of dropdown")
        // console.log("Setting the options")
        // console.log({ options })
        setOptionsList(options)
        if (selection && !options.find(el => el.id === selection)) {
            // If the options list thats given changes this might mean the option that was selected was deleted. So we check for this and in case it doesn't exist anymore then select the default option
            // console.log(`Setting selection to ${null}`)
            setSelection(null)
        }
        // console.log("< Outside of options useEffect inside of dropdown")
    }, [options])

    useEffect(() => {
        // console.log("> Inside of resetTrigger useEffect inside of dropdown")
        if (selection && resetTrigger) {
            // console.log("Setting selection to null")
            setSelection(null)
        }
        // console.log("< Outside of resetTrigger useEffect inside of dropdown")
    }, [resetTrigger])

    /** @param {null | Number} id - The id of the new option selected. If it's null then it will reset the selection and the display text to the default values.*/
    const handleSelectOption = id => {
        if (id === null) {
            setSelection(null)
            onSelectCallback(null)
        }
        else {
            let newSelection = optionsList.find(option => option.id === id)?.id || null
            setSelection(newSelection)
            onSelectCallback(newSelection)
        }
        setIsOpen(false)
        setSearchText("")
    }

    /** When the user searches for an option and none matches exactly with the text provided then the user can create this new option through a button, which will use a callback that's expected to append it to the options provided to the component. */
    const handleNewOption = () => {
        setSelection(onCreateCallback(searchText))
        setIsOpen(false)
        setSearchText("")
    }

    return (
        <div ref={dropdownRef}>
            {/* The Dropdown trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                {options.find(option => option.id === selection)?.value || defaultText}
            </button>
            {/* The dropdown */}
            {isOpen &&
                <div
                    className="dropdown-body"
                    style={{ backgroundColor: "lightblue", position: "absolute", height: "10rem", overflowY: "scroll", width: "15rem", whiteSpace: "nowrap" }}
                >
                    {/* The search input */}
                    <input
                        name="dropdown-search"
                        placeholder={searchPlaceholder}
                        onChange={event => setSearchText(event.target.value)}
                        value={searchText}
                    />
                    {/* The options */}
                    {optionsList.length > 0 ?
                        optionsList.map(
                            option =>
                                <li
                                    key={option.id}
                                    onClick={() => handleSelectOption(option.id)}
                                    style={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis", listStyle: "none" }}
                                >
                                    {option.value}
                                </li>
                        )
                        :
                        <li>No results</li>
                    }
                    {/* If there is no option named exactly as the search text then give the user the option to create it right there */}
                    {searchText.trim() !== "" && !optionsList.find(option => option.value === searchText.trim()) &&
                        <button onClick={handleNewOption}>Create "{searchText}"</button>
                    }
                </div>
            }
            {/* A small button to the side of the dropdown to reset its selection */}
            {selection !== null &&
                <button onClick={() => handleSelectOption(null)}>
                    X
                </button>
            }
        </div>
    )
}

export default DropdownSearch;