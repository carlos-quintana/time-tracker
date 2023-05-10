import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../hooks/useModal";
import Modal from "../../Shared Components/Modal";
import Cookies from 'universal-cookie';

type Props = {
    clearAllData: Function,
}
const OptionsPage = ({ clearAllData }: Props) => {

    const navigate = useNavigate();
    const cookies = new Cookies();

    const [isAutoResetDisabled, setIsAutoResetDisabled] = useState<boolean>(localStorage.getItem('disableAutoReset') === 'true');

    // This is for the modal that asks for confirmation when the user tries to reset all tasks and projects to the initial examples
    const { isOpen: isOpenReset, openModal: openModalReset, closeModal: closeModalReset } = useModal(false);

    // This is for the modal that asks for confirmation when the user tries to clear all tasks and projects
    const { isOpen: isOpenClear, openModal: openModalClear, closeModal: closeModalClear } = useModal(false);

    /** This function reloads the application and restores all of the dummy data in the example files. We do this by clearing the Local Storage and reloading the app, which the application will interpret as a new user entering for the first time. */
    const resetData = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
    }

    /** This function will set tasks, currentTask and projects to an empty array, effectively removing all of the data and leaving the application blank */
    const clearData = () => {
        clearAllData();
        setTimeout(() => navigate('/'), 500);
    }

    const toggleAutoResetCookie = () => {
        if (isAutoResetDisabled) return;
        localStorage.setItem('disableAutoReset', 'true');
        cookies.remove('autoReset');
        setIsAutoResetDisabled(true);
    }

    return (
        <div className="page">
            <h2>Options</h2>
            <hr />
            <div className="option__container">
                {/* Option 1: Reset the tasks and projects to the examples */}
                <div className="option__control">
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
                        <p>This will <strong>replace all</strong> Tasks and Projects to the example data.<br />
                            This action is permanent.<br />
                            Are you sure you want to continue?</p>
                    </Modal>
                </div>
                <div className="option__description">
                    This option will remove all of the current tasks and projects and replace them with the example data.
                </div>
            </div>
            <div className="option__container">
                {/* Option 2: Delete all tasks and projects */}
                <div className="option__control">
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
                        <p>This will <strong>delete all</strong> Tasks and Projects.<br />
                            This action is permanent.<br />
                            Are you sure you want to continue?</p>
                    </Modal>
                </div>
                <div className="option__description">
                    This option will delete all of the current tasks and projects.
                </div>
            </div>
            <div className="option__container">
                {/* Option 3: Toggle the auto reset cookie */}
                <div className="option__control">
                    <button className={`button ${isAutoResetDisabled ? 'button-disabled' : 'button-primary'}`}
                        onClick={toggleAutoResetCookie}
                        disabled={isAutoResetDisabled}
                    >
                        Toggle auto-reset
                    </button>
                </div>
                <div className="option__description">
                    When you toggle this setting the program will disable the auto-resetting cookie that clears the data every couple hours, which means until this option is toggled, any data you create in this application <strong>will not</strong> be persisted.
                </div>
            </div>
        </div >
    );
};

export default OptionsPage;