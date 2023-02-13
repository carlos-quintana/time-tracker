import { useEffect, useState } from "react";

const DropdownSearch = ({ buttonText, searchPlaceholderText, optionsList: options, initialSelection, onSelectCallback, }) => {

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

    useEffect(() => setOptionsList(options), [options]);

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
            let newSelection = optionsList.find(option => option.id === id)?.name || buttonText
            setSelection(newSelection)
            onSelectCallback(newSelection)
        }
        setIsOpen(false)
        setSearchText("")
    }

    return (
        <div>
            {/* The Dropdown trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
            >
                {selection || buttonText}
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
                            <p>No results</p>
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