import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Context } from "../store/appContext";
import "../../styles/LoginAndSignUp.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { SignGoogle, LoginNormal } from "../component/registro";



export const LogIn = () => {


    

    const navigate = useNavigate();


    const { store, actions } = useContext(Context);
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const username = localStorage.getItem("username");
    
        if (username != undefined) {
            navigate("/private"); 
        }
    }, [navigate]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        await LoginNormal(username, password, navigate);
    }



    return (
        <div className="text-center  d-flex justify-content-center login">

            <div className="divFormlog container d-flex justify-content-center row ">

                {/* <h2 className="mb-5" id="Help">LogIn</h2> */}
                <br></br>
                <form className="formLogin d-flex justify-content-center border border-3 border-dark row col-md-5" onSubmit={handleSubmit}>
                    <h1 className="mt-3" id="Help">Iniciar Sesión</h1>
                    <div className="col-md-8 col-lg-9 col-xl-10 mb-3">
                        <input type="text" className="form-control sombra" placeholder="Nombre de usuario"
                            value={username} onChange={(e) => setUsername(e.target.value)} required />

                    </div>

                    <div className="col-md-8 col-lg-9 col-xl-10 mb-3">
                        <div className="d-flex input-group sombra">
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

                    <div className="mt-1 mb-4">
                        <p className="" id="Help">¿No tienes una cuenta? Registrate <a className="text-warning" href="/signup">aqui</a></p>
                        <button type="submit" className="acceso col-5 ms-0">Iniciar sesion</button>
                    </div>
                    <p id="Help" className="pb-0 mb-1"> Iniciar con</p>
                    <div className="btn-google">

                        <GoogleLogin
                            onSuccess={(credentialResponse) => SignGoogle(credentialResponse, navigate)}
                            onError={() => {
                                console.log("Error en la autenticación con Google");
                                alert("Error en la autenticación con Google. Inténtalo de nuevo.");
                            }}
                            buttonText="Continuar con Google"
                            width={130}
                        />
                    </div>
                </form>



            </div>


        </div>
    );
};
