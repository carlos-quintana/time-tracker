import React from "react";

const ControlsPanel = () => {

    // Modal

    /**
     * This function reloads the application and restores all of the dummy data in the example files. We do this by clearing the Local Storage, which the application will interpret as a new user entering for the first time.
     */
    const resetData = () => {
        localStorage.clear()
        window.location.reload()
    }

    return (
        <>
            <button className="button button-warning" onClick={resetData} >
                Reset data
            </button>
            <span> This will reset all Tasks and Projects to the example data.</span>
        </>
    );
}

export default ControlsPanel;