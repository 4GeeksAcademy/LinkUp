import React from "react";
import { Link } from "react-router-dom";
import imgLogo from "../../img/img-logo.webp";
import user from "../../img/mobile.png"

export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
			<div className="d-flex align-items-center">
				<img
					src={imgLogo}
					alt="Company Logo"
					className="rounded-circle"
					width="40"
					height="40"
				/>
				<span className="ms-2 fw-bold">LinkUp</span>
			</div>
			<div className="ms-auto d-flex align-items-center">
				<span className="me-2">Hi, Usuario</span>
				<img
					src="/path-to-user.png"
					alt="User Avatar"
					className="rounded-circle"
					width="40"
					height="40"
				/>
			</div>
		</nav>
	);
};
