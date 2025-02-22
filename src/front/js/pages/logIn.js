import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import { Link } from "react-router-dom";

export const LogIn = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="container">
        <div className="text-center mt-5">
            <h1>LogIn</h1>
            
        </div>
        </div>
    );
};
