import { useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";

/**
 * This hook works alongside the Popover component, which represents as very small floating window that appears on top of a designated element and contains a small message. It's like a modal but less intrusive, and can be used to deliver messages, ask for confirmation for an action, etc. The parent component that will utilize this custom hook to initialize a series of state variables and DOM refs that the Popover component needs. This hook and said component, rely heavily on the use of React Popper. For more information visit the docs: https://popper.js.org/react-popper/v2/ 
 */
export default function usePopover() {
    /** This relates to the popover that will appear over the delete button when clicked */
    const [isOpenPopover, setIsOpenPopover] = useState(false);
    const [refFocusElement, setRefFocusElement] = useState(null);
    const [refPopperElement, setRefPopperElement] = useState(null);
    const { styles, attributes } = usePopper(refFocusElement, refPopperElement, {
        placement: 'top', modifiers: [{ name: 'flip', enabled: false }]
    });

    /** With this ref we'll be able to add a Listener to the document to know when the user clicks outside of the popover and close it */
    const popoverRef = useRef(null);
    /** Since the button that triggers the popover occupies a different space than the popover, we need to skip that check for the first time, otherwise it will never open */
    const popoverFirstClick = useRef(false);

    const openPopover = () => setIsOpenPopover(true)
    const closePopover = () => {
        setIsOpenPopover(false)
        popoverFirstClick.current = false;
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (isOpenPopover) {
                if (popoverFirstClick.current) { // If the flag is true
                    if (popoverRef.current && !popoverRef.current.contains(event.target))  // If the click is outside of the popover
                        closePopover()
                } else
                    popoverFirstClick.current = true;
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpenPopover]);

    const popoverProps = { isOpenPopover, setRefPopperElement, popoverRef, styles, attributes }

    return {
        isOpenPopover, // Boolean that controls the conditional rendering of the Popover
        openPopover,  // Void function that opens the Popover
        closePopover, // Void function that closes the Popover
        setRefFocusElement, // This goes in the 'ref' attribute of the focus element and comes from the Popper documentation
        popoverProps // This contains more state variables and refs that the parent component shouldn't be concerned about and go to the Popover component
    }
}