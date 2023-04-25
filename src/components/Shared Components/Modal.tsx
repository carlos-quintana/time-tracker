import CloseIcon from '@mui/icons-material/Close';
import { MouseEventHandler } from 'react';

type Props = {
    children: any,
    isOpen: boolean,
    closeModal: Function,
    modalTitle?: string,
    hasConfirmation?: boolean,
    confirmationButtonText?: string,
    onConfirmationCallback?: Function | null
}

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
    onConfirmationCallback = null }: Props) => {

    const handleConfirmation = () => {
        onConfirmationCallback && onConfirmationCallback();
        closeModal();
    }

    return (
        <article
            className={`modal ${isOpen && "modal--is-open"}`}
            onClick={closeModal as MouseEventHandler<HTMLButtonElement>}
        >
            <div
                className="modal__container"
                onClick={event => event.stopPropagation()}
            >
                <div className="modal__header">
                    <h2 className="modal__title">{modalTitle}</h2>
                    <button
                        className="modal__close button button-danger"
                        onClick={closeModal as MouseEventHandler<HTMLButtonElement>}
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className="modal__content">
                    {children}
                </div>

                <div className="modal__footer">
                    {
                        hasConfirmation &&
                        <button
                            className="button button-primary"
                            onClick={handleConfirmation}
                        >
                            {confirmationButtonText}
                        </button>
                    }
                    <button
                        className={`button ${hasConfirmation ? "" : "button-primary"}`}
                        onClick={closeModal as MouseEventHandler<HTMLButtonElement>}
                    >
                        {hasConfirmation ? "Cancel" : "Okay"}
                    </button>
                </div>
            </div>
        </article>
    )
}

export default Modal;