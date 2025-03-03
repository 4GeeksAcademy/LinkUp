import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import "../../styles/LoginAndSignUp.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";



export const LogIn = () => {


    
    const backendUrl = process.env.BACKEND_URL
    const navigate = useNavigate();

    const onSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;
        try {
            // decodificamos la credencial para accedesr datos del usuario "google"
            const decoded = jwtDecode(credential);
            console.log("Usuario autentificado: ", decoded);

            // peticion al Backend para autentificar el usuario
            const response = await axios.post(`${backendUrl}/login_google`,
                { tokenId: credentialResponse.credential }, { withCredentials: true });
            console.log(response);


            //redirigimos al usuario a la parina de private
            if (response.status === 201) {
                console.log("Respuesta del backend:", response.data);
                navigate("/private")
            } else {
                console.error("Error en la respuesta del backend:", response.data);
            }
        }
        catch (error) {
            console.error("Error al autentificar:", error.response ? error.response.data : error.message);
        }
    };

    const onFailure = (error) => {
        console.log("Fallo en el login: ", error);

    }

    const [user, setUser] = useState(null);

    const { store, actions } = useContext(Context);

    return (
        <div className="text-center  d-flex justify-content-center login"  >

            <div className="divFormlog container d-flex justify-content-center row ">

                {/* <h2 className="mb-5" id="Help">LogIn</h2> */}
                <br></br>
                <form className="formSign d-flex justify-content-center border border-3 border-dark row col-md-5">
                    <h1 className="mt-3" id="Help">Login</h1>
                    <div className="col-md-8 col-lg-9 col-xl-10">
                        <label htmlFor="exampleInputUsername" className="form-label"></label>
                        <input type="text" className="form-control sombra" placeholder="Nombre de usuario" id="exampleInputUsername" required />

                    </div>

                    <div className="col-md-8 col-lg-9 col-xl-10">
                        <label htmlFor="exampleInputPassword1" className="form-label"></label>
                        <div className=" d-flex input-group sombra">
                            <input type="password" className="form-control" placeholder="Contraseña" id="exampleInputPassword1" required />
                            <span className="input-group-text" id="inputGroupPrepend"><i className="fa-solid fa-eye"></i></span>
                        </div>


                    </div>

                    <div className="my-3">
                        <p className="" id="Help">¿No tienes una cuenta? Registrate <a className="text-warning" href="/signup">aqui</a></p>
                        <button type="submit" className="acceso col-5 ms-0">Iniciar sesion</button>
                    </div>
                    <p id="Help" className="pb-0 mb-1"> Iniciar con</p>
                    <div className="mb-4 d-flex justify-content-center">
                        <div className="sombra boxGoogle">

                            <GoogleLogin
                                onSuccess={onSuccess}
                                onError={onFailure}
                                buttonText="Continuar con Google"
                                theme="outline"
                                size="large"
                                logo_alignment="left" />
                        </div>
                    </div>
                </form>



            </div>


        </div>
    );
};
