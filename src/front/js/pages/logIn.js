import React, { useContext, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import { Link } from "react-router-dom";

export const LogIn = () => {
    const { store, actions } = useContext(Context);
    const clientId = "18163537172-9lapegg0ukbca7p9man17m3due5dh29n.apps.googleusercontent.com"

    return (
        <div className="container">
        <div className="text-center mt-5">
            <h1>LogIn</h1>
            
        </div>
        </div>
    );
};
