import { useState } from "react";

export const useModal = (initialOpenValue = false) => {
    const [isOpen, setIsOpen] = useState(initialOpenValue);

    return {
        "isOpen": isOpen,
        "openModal": () => setIsOpen(true),
        "closeModal": () => setIsOpen(false)
    }
}