import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Header />
            <div className="content">
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default Layout;