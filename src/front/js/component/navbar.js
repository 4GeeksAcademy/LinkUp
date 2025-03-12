import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import imgLogo from "../../img/img-logo.webp";
import user from "../../img/user.webp";
import api from './../api';


const endSession = async ()=>{

	const token = localStorage.getItem("token")

	await api.get("/logout", { headers: { Authorization: `Bearer ${token}` } })
    .then(response => {
        console.log("Datos obtenidos correctamente:", response.data);
    
            // Si el backend indica que el usuario no está autorizado, eliminar datos
            localStorage.removeItem("username");
			localStorage.removeItem("email");
			localStorage.removeItem("picture");
            localStorage.removeItem("token");
            window.location.href = "/login"; // Redirigir al usuario al login
        })
    	.catch(error => {
			console.error("Error al cerrar sesión:", error);
			// Asegurar que, incluso con error, se borren los datos
			localStorage.removeItem("username");
			localStorage.removeItem("email");
			localStorage.removeItem("picture");
			localStorage.removeItem("token");
			window.location.href = "/login";
	});
}

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
				<div className="dropdown">
					<a className="btn dropdown-toggle text-white" data-bs-toggle="dropdown" aria-expanded="false">
						Hi, Usuario
					</a>
					<ul className="dropdown-menu">
						<li>
							<a className="dropdown-item" href="/profile">Perfil</a>
						</li>
						<li>
							<a className="dropdown-item" onClick={endSession}>Cerrar sesión</a>
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
