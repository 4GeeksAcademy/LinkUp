
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Context } from "../store/appContext";
import "../../styles/LoginAndSignUp.css";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


import { SignNormal, SignGoogle } from "../component/registro";

export const SignUp = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        await SignNormal(username, email, password, navigate);
    };

    return (
        <div className="text-center d-flex justify-content-center signup">
            <div className="divForm container d-flex justify-content-center ">
                <form className="formSign border border-3 border-dark row col-md-5 d-flex flex-column align-items-center" onSubmit={handleSubmit}>
                    <h1 className="mt-3" id="Help">Registro</h1>
                    <p id="Help">Introduce tus datos</p>
                    
                        <div className="p-0 col-md-8 col-lg-9 col-xl-10 mb-3 sombra mx-auto">
                            <input type="text" className="form-control sombra" placeholder="Nombre de usuario"
                                value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className=" p-0  col-md-8 col-lg-9 col-xl-10  mb-3 sombra mx-auto">
                            <input type="email" className="form-control" placeholder="Email"
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="p-0 col-md-8 col-lg-9 col-xl-10 mb-3 sombra mx-auto">
                            <div className="d-flex input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                                    <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                                </span>
                            </div>
                        </div>

                        <div className="p-0 col-md-8 col-lg-9 col-xl-10 mb-3 sombra mx-auto">
                            <div className="d-flex input-group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Confirma tu contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <span className="input-group-text" onClick={toggleConfirmPasswordVisibility} style={{ cursor: "pointer" }}>
                                    <i className={showConfirmPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                                </span>
                            </div>
                        </div>
                        <div className="p-0 col-md-8 col-lg-9 col-xl-10 mb-3 mx-auto">
                        <p className="" id="Help">¿Tienes una cuenta? Accede <a className="text-warning" href="/login">aquí</a></p>
                            <button type="submit" className="acceso col-5 ms-0">Registro</button>
                            
                        </div>

                        <p id="Help">Registrarse con</p>
                        <div className="btn-google">
                        
                            <GoogleLogin
                                onSuccess={(credentialResponse) => SignGoogle(credentialResponse, navigate)}
                                onError={() => {
                                    console.log("Error en la autenticación con Google");
                                    alert("Error en la autenticación con Google. Inténtalo de nuevo.");
                                }}
                                buttonText="Registrarse con Google"
                                width={130}
                            />
                        </div>
                    
                </form>
            </div>
        </div>
    );
};
