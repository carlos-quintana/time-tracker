import React, { useState } from "react";

export const useModal = (initialOpenValue = false) => {
    const [isOpen, setIsOpen] = useState(initialOpenValue);

    const openModal = () => setIsOpen(true)

    const closeModal = () => setIsOpen(false);

    return [
        isOpen,
        openModal,
        closeModal
    ]
}