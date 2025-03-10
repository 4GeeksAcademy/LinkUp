import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import imgLogo from "../../img/img-logo.webp";
import user from "../../img/user.webp";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-expand-lg px-4 text-white" id="navbar">
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
				<div class="dropdown">
					<a class="btn dropdown-toggle text-white" data-bs-toggle="dropdown" aria-expanded="false">
						Hi, Usuario
					</a>
					<ul class="dropdown-menu">
						<li>
							<a class="dropdown-item" href="/profile">Perfil</a>
						</li>
						<li>
							<a class="dropdown-item" href="/">Cerrar sesión</a>
						</li>
					</ul>
				</div>
				<img
					src={user}
					alt="User Avatar"
					className="rounded-circle"
					width="40"
					height="40"
				/>
			</div>
		</nav>
	);
};
