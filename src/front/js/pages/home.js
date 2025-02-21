import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import { Link } from "react-router-dom";

export const Home = () => {
    const { store, actions } = useContext(Context);

    return (
        <main className="main">
            <nav className="nav" id="nav">
                <div className="logo">
                    <div className="img-logo"></div>
                    LinkUp
                </div>
                <Link to={logIn}>
                    <button className="empezar">Ingresar</button>
                </Link>
            </nav>

            <article className="slogan-img">
                <div className="info">
                    <h2>Ahora tu App de <br /> gestor de pago <br /> en Web</h2>
                    <p className="info-text">
                        <span className="color-acento">Dividir los gastos</span> debería ser fácil. Ya sea para un <br /> 
                        viaje en grupo, una noche con amigos o un hogar <br /> 
                        compartido, la <span className="color-acento"> app de seguimiento de gastos </span> de <br /> 
                        Tricount hace que <span className="color-acento"> gestionar los gastos compartidos </span> <br /> 
                        sea sencillo.
                    </p>
                    <Link to={signUp}>
                        <button className="empezar">Empezar ahora</button>
                    </Link>
                </div>
                <div className="container-img">
                    <img src="" alt="" />
                </div>
            </article>
        </main>
    );
};
