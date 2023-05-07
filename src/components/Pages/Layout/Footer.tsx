// Material Icons
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
    return (
        <footer className="footer">
            <h4>This demo was created by Carlos Quintana</h4>
            <a href="https://carlos-quintana.github.io/" target="_blank" rel="noreferrer">
                <WorkOutlineIcon /> See my Web Portfolio and other Projects
            </a>
            <a href="https://github.com/carlos-quintana/" target="_blank" rel="noreferrer">
                <GitHubIcon /> See my GitHub Page
            </a>
            <a href="https://www.linkedin.com/in/carlos-quintana-dev/" target="_blank" rel="noreferrer">
                <LinkedInIcon /> Let's get in touch through LinkedIn
            </a>
        </footer>
    )
};

export default Footer;