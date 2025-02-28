import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import "../../styles/LoginAndSignUp.css";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link } from "react-router-dom";



export const SignUp = () => {

    const clientId = "18163537172-9lapegg0ukbca7p9man17m3due5dh29n.apps.googleusercontent.com"
    const onSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;
        try {
            // decodificamos la credencial para accedesr datos del usuario "google"
            const decoded = jwtDecode(credential);
            console.log("Usuario autentificado: ", decoded); //llega datos de usiario... estudiar posiblidad de if..

            // peticion al Backend para autentificar el usuario
            const response = await axios.post("https://cautious-chainsaw-rj44xx4w449f5wxg-3000.app.github.dev/login_google",
                { tokenId: credential }, { withCredentials: true });

            //redirigimos al usuario a la parina de private
            if (response.status === 200) {
                console.log("Respuesta del backend:", response.data);
                window.location.href = "https://cautious-chainsaw-rj44xx4w449f5wxg-3000.app.github.dev/private";
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
        <div className="text-center  d-flex justify-content-center signup"  >

            <div className="divForm container d-flex justify-content-center row ">

                {/* <h2 className="mb-5" id="Help">Registro</h2> */}
                <br></br>
                <form className="formSign d-block border border-3 border-dark col-md-5">
                    <h1 className="mt-3 " id="Help">SignUP</h1>
                    <p id="Help">Introduce tus datos</p>
                    <div className="row d-flex justify-content-center">
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-9 col-lg-9 col-xl-10 ">
                                <label forhtml="exampleInputUsername" className="form-label"></label>
                                <div className="d-block">
                                    <input type="text" className="form-control" placeholder="Nombre de usuario" id="exampleInputUsername" required />

                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-9 col-lg-9 col-xl-10">
                                <label forhtml="exampleInputEmail1" className="form-label"></label>
                                <input type="email" className="form-control" placeholder="Email" id="exampleInputEmail1" aria-describedby="emailHelp" required />

                            </div>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-9 col-lg-9 col-xl-10">
                                <label forhtml="exampleInputPassword1" className="form-label"></label>
                                <div className="d-flex input-group">
                                    <input type="password" className="form-control input-group" placeholder="Contraseña" id="exampleInputPassword1" required />
                                    <span className="input-group-text" id="inputGroupPrepend"><i className="fa-solid fa-eye"></i></span>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-9 col-lg-9 col-xl-10 mb-2">
                                <label forhtml="exampleInputPassword2" className="form-label"></label>
                                <div className="d-flex input-group">
                                    <input type="password" className="form-control" placeholder="Confirma tu contraseña" id="exampleInputPassword2" required />
                                    <span className="input-group-text" id="inputGroupPrepend"><i className="fa-solid fa-eye"></i></span>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="my-3">
                        <button type="submit" className="acceso col-5 ms-0">Registrarse</button>
                    </div>
                    <p id="Help"className="mb-1 pb-0">Registrarse con</p>
                    <div className="mb-3 d-flex justify-content-center">

                        <GoogleLogin
                            clientId={clientId}
                            onSuccess={onSuccess}
                            onError={onFailure}
                            buttonText="Continuar con Google"
                            theme="outline"
                            size="large"
                            width={150}                            
                            logo_alignment="left" />
                    </div>
                </form>



            </div>


        </div>
    );
};
