import React from "react";
import { useModal } from "../../hooks/useModal";
import Modal from "../Shared Components/Modal";

const ControlsPanel = () => {

    let [isOpenModal, openModal, closeModal] = useModal(false);

    /** This function reloads the application and restores all of the dummy data in the example files. We do this by clearing the Local Storage, which the application will interpret as a new user entering for the first time. */
    const resetData = () => {
        localStorage.clear()
        window.location.reload()
    }

    return (
        <>
            <button className="button button-warning" onClick={openModal} >
                Reset data
            </button>

            <Modal
                isOpen={isOpenModal}
                closeModal={closeModal}
                modalTitle="Warning"
                hasConfirmation={true}
                onConfirmationCallback={resetData}
            >
                <p>This will reset all Tasks and Projects to the example data.</p>
            </Modal>


        </>
    );
}

export default ControlsPanel;