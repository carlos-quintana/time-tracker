import { Link } from "react-router-dom";

const Error404Page = () => {
    return (
        <div className="page" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>404</h2>
            <span>There's nobody here</span>
            <Link to="/" className="link">Go back to the main page</Link>
        </div>
    );
}

export default Error404Page;