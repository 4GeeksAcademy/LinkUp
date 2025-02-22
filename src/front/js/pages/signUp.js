import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import { Link } from "react-router-dom";


export const SignUp = () => {

    const [user, setUser] = useState(null);

    const { store, actions } = useContext(Context);

    return ( 
        <div className="text-center mt-5 d-flex justify-content-center signup"  >
            
            <div className="divForm w-25 ">
                
            <h2 className="mb-5" id="Help">Registro de usuario nuevo</h2>
            <br></br>
                <form className="formSign d-flex justify-content-center border border-3 border-dark row">
                    <h1 className="mt-3" id="Help">Introduce tus datos</h1>
                    <div className="col-9">
                        <label for="exampleInputUsername" className="form-label"></label>
                        <input type="text" className="form-control" placeholder="Nombre de usuario" id="exampleInputUsername"  required/>
                        <div id="Help" className="form-text">Introduce un nombre usuario.</div>
                    </div>
                    <div className="col-9">
                        <label for="exampleInputEmail1" className="form-label"></label>
                        <input type="email" className="form-control" placeholder="Email" id="exampleInputEmail1" aria-describedby="emailHelp" required />
                        <div id="Help" className="form-text">Nunca se compartira tu email.</div>
                     </div>
                    <div className="col-9">
                        <label for="exampleInputPassword1" className="form-label"></label>
                        <input type="password" className="form-control" placeholder="Contraseña" id="exampleInputPassword1"  required/>
                        <div id="Help" className="form-text">Introduce una contraseña segura</div>
                    </div>
                    <div className="col-9 mb-2">
                        <label for="exampleInputPassword2" className="form-label"></label>
                        <input type="password" className="form-control" placeholder="Confirma tu contraseña" id="exampleInputPassword2"  required/>
                        <div id="Help" className="form-text">Verifica que es correcta</div>
                    </div>
                    <div className="">
                    <button type="submit" className="btn btn-primary col-5 mb-3">register by google</button> 
                    </div>
                    <button type="submit" className="btn btn-primary col-5 mb-3">Submit</button>
                </form>



            </div>


        </div>
    );
};
