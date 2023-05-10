// Material Icons
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkIcon from '@mui/icons-material/Work';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
    return (
        <footer className="footer">
            <h4>This demo was created by Carlos Quintana</h4>
            <div className="footer-links">
                <a href="https://carlos-quintana.github.io/" target="_blank" rel="noreferrer">
                    <WorkIcon /> Web Portfolio
                </a>
                <a href="https://github.com/carlos-quintana/" target="_blank" rel="noreferrer">
                    <GitHubIcon /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/carlos-quintana-dev/" target="_blank" rel="noreferrer">
                    <LinkedInIcon /> LinkedIn
                </a>
            </div>
        </footer>
    )
};

export default Footer;