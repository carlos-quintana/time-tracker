import { useModal } from "../../../hooks/useModal";
import Modal from "../../Shared Components/Modal";

const ControlsPanel = () => {

    const { isOpen: isOpenReset, openModal: openModalReset, closeModal: closeModalReset } = useModal(false);

    /** This function reloads the application and restores all of the dummy data in the example files. We do this by clearing the Local Storage, which the application will interpret as a new user entering for the first time. */
    const resetData = () => {
        localStorage.clear()
        window.location.reload()
    }

    return (
        <div className="data-reset">
            <button className="button button-warning" onClick={openModalReset} >
                Reset data
            </button>
            <Modal
                isOpen={isOpenReset}
                closeModal={closeModalReset}
                modalTitle="Warning"
                hasConfirmation={true}
                onConfirmationCallback={resetData}
            >
                <p>This will reset all Tasks and Projects to the example data.</p>
            </Modal>
        </div>
    );
}

export default ControlsPanel;