import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "@/components/scrollToTop";

import './styles/index.scss'

import { Home } from "@/views/Home.jsx";
import { Navbar } from "@/components/Navbar.jsx";
import UserProperties from "./components/UserProperties";

const Layout = () => {
	//the basename is used when your project is published in a subdirectory and not in the root of the domain
	// you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
	const basename = import.meta.env.VITE_BASE_PATH || "";

	return (
			<BrowserRouter basename={basename}>
				<ScrollToTop>
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="*" element={<h1>Not found!</h1>} />
					</Routes>
				</ScrollToTop>
				<UserProperties /> {/* Add user properties floating dropdown to all Routes */}
			</BrowserRouter>
	);
};

export default Layout;
