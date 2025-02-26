import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link } from "react-router-dom";



export const LogIn = () => {

    const clientId = "18163537172-9lapegg0ukbca7p9man17m3due5dh29n.apps.googleusercontent.com"
    const onSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;
        try {
            // decodificamos la credencial para accedesr datos del usuario "google"
            const decoded = jwtDecode(credential);
            console.log("Usuario autentificado: ", decoded);

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
        <div className="text-center  d-flex justify-content-center login"  >

            <div className="divFormlog w-25 ">

                {/* <h2 className="mb-5" id="Help">LogIn</h2> */}
                <br></br>
                <form className="formSign d-flex justify-content-center border border-3 border-dark row">
                    <h1 className="mt-3" id="Help">LogIn</h1>
                    <div className="col-9">
                        <label forhtml="exampleInputUsername" className="form-label"></label>
                        <input type="text" className="form-control" placeholder="Nombre de usuario" id="exampleInputUsername" required />

                    </div>

                    <div className="col-9">
                        <label forhtml="exampleInputPassword1" className="form-label"></label>
                        <div className=" d-flex input-group">
                            <input type="password" className="form-control" placeholder="Contraseña" id="exampleInputPassword1" required />
                            <span class="input-group-text" id="inputGroupPrepend"><i className="fa-solid fa-eye"></i></span>
                        </div>


                    </div>

                    <div className="my-3">
                        <button type="submit" className="btn btn-primary col-5 mb-3">Iniciar sesion</button>
                    </div>
                    <p id="Help"> Continuar con</p>
                    <div className="mb-4 d-flex justify-content-center">

                        <GoogleLogin
                            clientId={clientId}
                            onSuccess={onSuccess}
                            onError={onFailure}
                            buttonText="Continuar con Google"
                            theme="outline"
                            size="large"
                            logo_alignment="left" />
                    </div>
                </form>



            </div>


        </div>
    );
};
