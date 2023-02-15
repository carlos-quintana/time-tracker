import { useEffect, useState } from "react";

// Options are of the form {id: number, name: string}
const DropdownSearch = ({ buttonText, searchPlaceholderText, optionsList: options, initialSelection, onSelectCallback, onCreateCallback }) => {

    const [selection, setSelection] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [optionsList, setOptionsList] = useState([])

    useEffect(() => {
        console.log(initialSelection)
        if (initialSelection) {
            setSelection(initialSelection)
        }
    }, [])

    useEffect(() => {
        // If the options list thats given changes this might mean the option that was selected was deleted. So we check for this and in case it doesn't exist anymore then select the default option
        if (selection != null) {
            setOptionsList(options)
            if (!options.find(el => el.id === selection))
                setSelection(null)
        }
    }, [options])



    useEffect(() => {
        if (searchText.trim() === "")
            setOptionsList(options)
        else
            setOptionsList(
                options.filter(option =>
                    option.name.toLowerCase()
                        .includes(searchText.trim().toLowerCase()))
            )
    }, [searchText])

    const handleSelectOption = id => {
        if (id === null) {
            // Callback to the option to reset
            setSelection(null)
            onSelectCallback(null)
        }
        else {
            // Callback to submit this option
            let newSelection = optionsList.find(option => option.id === id)?.id || null
            setSelection(newSelection)
            onSelectCallback(newSelection)
        }
        setIsOpen(false)
        setSearchText("")
    }

    const handleNewProject = () => {
        setSelection(onCreateCallback(searchText))
        setIsOpen(false)
        setSearchText("")
    }

    return (
        <div>
            {/* The Dropdown trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
            >
                {options.find(option => option.id === selection)?.name || buttonText}
            </button>
            {/* The dropdown */}
            {isOpen &&
                <div
                    className="dropdown-body"
                    style={{ backgroundColor: "lightblue", position: "absolute", height: "10rem", overflowY: "scroll", width: "15rem", whiteSpace: "nowrap" }}
                >
                    {/* The search input */}
                    <input
                        placeholder={searchPlaceholderText}
                        onChange={event => setSearchText(event.target.value)}
                        value={searchText}
                    />
                    {/* The options */}
                    {
                        optionsList.length > 0 ?
                            optionsList
                                .map(
                                    option =>
                                        <li
                                            key={option.id}
                                            onClick={() => handleSelectOption(option.id)}
                                            style={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis", listStyle: "none" }}
                                        >
                                            {option.name}
                                        </li>
                                )
                            :
                            <>
                                <p>No results</p>
                            </>

                    }
                    {/* If there is no project named exactly as the search text then give the user the option to create it right there */}
                    {searchText.trim() !== "" && !optionsList.find(option => option.name === searchText.trim()) &&
                        <button onClick={handleNewProject}>Create project "{searchText}"</button>
                    }
                </div>
            }
            {/* A small button to the side of the dropdown to reset its selection */}
            {
                selection !== null &&
                <button
                    onClick={() => handleSelectOption(null)}
                >
                    X
                </button>
            }
        </div>
    )
}

export default DropdownSearch;