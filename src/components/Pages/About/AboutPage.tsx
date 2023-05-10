import GitHubIcon from '@mui/icons-material/GitHub';
const AboutPage = () => {
    return (
        <div className="page">
            <h2>About</h2>
            <hr />
            <h3>👋 Hello there</h3>
            <p>&bull; My name is Carlos, and I'm a Software Developer.</p>
            <p>&bull; This application was born both as a project to showcase my <strong>React</strong> and <strong>frontend development</strong> skills, and as a tool for my own personal use.</p>
            <p>&bull; Take a look at the project's Readme for instructions about how to use this application, to know more about the technologies used and a list of features it has:</p>
            <a href="https://github.com/carlos-quintana/time-tracker" target="_blank" rel="noreferrer" className='link'>
                <GitHubIcon /> Repository
            </a>
            <p>&bull; Find links to get in contact and know more about me at the bottom of this page.</p>
        </div>
    );
}

export default AboutPage;