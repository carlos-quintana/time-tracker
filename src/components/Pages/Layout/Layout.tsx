import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";

const Layout = () => {
    return (
        <>
            <Header />
            <Nav />
            <Outlet />
            <Footer />
        </>
    );
}

export default Layout;