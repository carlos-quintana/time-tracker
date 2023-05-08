type Props = {
    children: any,
    isOpenPopover: boolean,
    setRefPopperElement: any,
    popoverRef: any,
    styles: any,
    attributes: any
}
/**
 * This component represents as very small floating window that appears on top of a designated element and contains a small message. It's like a modal but less intrusive, and can be used to deliver messages, ask for confirmation for an action, etc. The parent component that will utilize this component will have to call the custom hook usePopover to initialize a series of state variables and DOM refs that the Popover component needs. This component and said hook, rely heavily on the use of React Popper. For more information visit the docs: https://popper.js.org/react-popper/v2/
 * 
 * @param {Object} props - TODO
 * @param {any} props.children - The inner content of the Popover. Shouldn't be much, an h1, a small text and zero, one or two buttons.
 * @param {boolean} props.isOpenPopover - This is used to determine when the Popover is visible or not.
 * @param {Function} props.setRefPopperElement - This goes in the 'ref' attribute of the outer Popover div and comes from the Popper documentation.
 * @param {import("react").LegacyRef<HTMLDivElement>} props.popoverRef - This goes in the 'ref' attribute of the inner Popover div and is used by the click event listener to tell when the user clicks outside of the Popover.
 * @param {Object} props.styles - This comes from the Popper documentation.
 * @param {Object} props.attributes - This comes from the Popper documentation.
 * @returns 
 */
const Popover = (props: Props) => {

    const { isOpenPopover, setRefPopperElement, popoverRef, styles, attributes } = props;

    return (
        <>
            {
                isOpenPopover &&
                <div
                    ref={setRefPopperElement}
                    style={{ ...styles.popper, display: 'flex', justifyContent: 'center', zIndex: 300 }}
                    {...attributes.popper}>
                    <div className="popover" ref={popoverRef}>
                        {props.children}
                    </div>
                </div>
            }
        </>
    )
}

export default Popover;