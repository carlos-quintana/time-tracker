import React from "react";

import {
    useDisclosure,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

const ControlsPanel = () => {

    // Modal
    const { isOpen, onOpen, onClose } = useDisclosure()

    /**
     * This function reloads the application and restores all of the dummy data in the example files. We do this by clearing the Local Storage, which the application will interpret as a new user entering for the first time.
     */
    const resetData = () => {
        localStorage.clear()
        window.location.reload()
    }

    return (
        <>
            <button className="button button-warning" onClick={onOpen} >
                Reset data
            </button>
            <span> This will reset all Tasks and Projects to the example data.</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Warning</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        This action will reset the application and replace all the current tasks, projects and other data with the initial example. Do you want to continue?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={resetData}>
                            Reset data
                        </Button>
                        <Button variant='ghost' onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ControlsPanel;