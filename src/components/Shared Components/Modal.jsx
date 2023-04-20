import React from "react";
import CloseIcon from '@mui/icons-material/Close';

/**
 * TODO
 * @param {Object} props - TODO
 * @param {any} props.children - TODO
 * @param {boolean} props.isOpen - TODO
 * @param {Function} props.closeModal - TODO
 * @param {string} [props.modalTitle] - TODO
 * @param {boolean} [props.hasConfirmation] - TODO
 * @param {string} [props.confirmationButtonText] - TODO
 * @param {null | Function} [props.onConfirmationCallback] - TODO
 * @returns 
 */
const Modal = ({
    children,
    isOpen,
    closeModal,
    modalTitle = "",
    hasConfirmation = false,
    confirmationButtonText = "Confirm",
    onConfirmationCallback = null
}) => {

    const handleConfirmation = () => {
        onConfirmationCallback && onConfirmationCallback();
        closeModal();
    }

    return (
        <article
            className={`modal ${isOpen && "modal--is-open"}`}
            // @ts-ignore
            onClick={closeModal}
        >
            <div
                className="modal__container"
                onClick={event => event.stopPropagation()}
            >
                <div className="modal__header">
                    <h2 className="modal__title">{modalTitle}</h2>
                    <button
                        className="modal__close button button-danger"
                        // @ts-ignore
                        onClick={closeModal}
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className="modal__content">
                    {children}

                </div>
                <div className="modal__footer">


                    <button
                        className={`button ${hasConfirmation ? "button-warning" : "button-success"}`}
                        // @ts-ignore
                        onClick={closeModal}
                    >
                        {hasConfirmation ? "Cancel" : "Okay"}
                    </button>
                    {
                        hasConfirmation &&
                        <button
                            className="button button-success"
                            onClick={handleConfirmation}
                        >
                            {confirmationButtonText}
                        </button>
                    }

                </div>
            </div>
        </article>
    )
}

export default Modal;