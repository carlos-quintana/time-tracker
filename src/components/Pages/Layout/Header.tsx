import { useEffect, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";

const Header = () => {

    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleHamburger = () => setIsNavOpen(!isNavOpen)

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (isNavOpen && !(event?.target?.id==="hamburger-button")) setIsNavOpen(false)
        }
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isNavOpen]);

    return (
        <>
            <header>
                <button id="hamburger-button" onClick={handleHamburger}>
                    <MenuIcon style={{pointerEvents: "none"}} />
                </button>
                <h2>Time Tracker application</h2>
            </header>
            <nav className={isNavOpen ? 'show' : ''}>
                <ul>
                    <li><Link to="/">Tasks</Link></li>
                    <li><Link to="/projects">Projects</Link></li>
                    <li><Link to="/options">Options</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </nav>
        </>
    );
};

export default Header;