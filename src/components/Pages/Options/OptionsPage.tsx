import { useModal } from "../../../hooks/useModal";
import Modal from "../../Shared Components/Modal";

const OptionsPage = () => {

    // This is for the modal that asks for confirmation when the user tries to reset all tasks and projects to the initial examples
    const { isOpen: isOpenReset, openModal: openModalReset, closeModal: closeModalReset } = useModal(false);

    // This is for the modal that asks for confirmation when the user tries to clear all tasks and projects
    const { isOpen: isOpenClear, openModal: openModalClear, closeModal: closeModalClear } = useModal(false);

    /** This function reloads the application and restores all of the dummy data in the example files. We do this by clearing the Local Storage, which the application will interpret as a new user entering for the first time. */
    const resetData = () => {
        localStorage.clear()
        // TODO - Redirect to /
        window.location.reload()
    }

    const clearData = () => {
        // TODO 
    }

    //@ts-ignore
    const toggleAutoResetCookie = () => {
        // TODO 
    }

    return (
        <div className="page">
            <h2>Options</h2>
            <hr />
            <div className="option-container">
                {/* Option 1: Reset the tasks and projects to the examples */}
                <div className="option-control">
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
                <div className="option-description">
                    This option will remove all of the current tasks and projects and replace them with the example data.
                </div>
            </div>
            <div className="option-container">
                {/* Option 2: Delete all tasks and projects */}
                <div className="option-control">
                    <button className="button button-danger" onClick={openModalClear} >
                        Clear data
                    </button>
                    <Modal
                        isOpen={isOpenClear}
                        closeModal={closeModalClear}
                        modalTitle="Warning"
                        hasConfirmation={true}
                        onConfirmationCallback={clearData}
                    >
                        <p>This will delete all Tasks and Projects.</p>
                    </Modal>
                </div>
                <div className="option-description">
                    This option will delete all of the current tasks and projects.
                </div>
            </div>
            <div className="option-container">
                {/* Option 3: Toggle the auto reset cookie */}
                <div className="option-control">

                </div>
                <div className="option-description">

                </div>

            </div>
        </div>
    );
};

export default OptionsPage;