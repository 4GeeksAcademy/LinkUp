import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import { Link } from "react-router-dom";
import mobile from "../../img/mobile.png";
import imgLogo from "../../img/img-logo.webp";
import creacion from "../../img/creacion-grupos.png";
import añadir from "../../img/añadir-gastos.png";
import saldar from "../../img/saldar.png";

export const Home = () => {
    const { store, actions } = useContext(Context);

    return (
        <main className="main">
            <nav className="nav" id="nav">
                <div className="logo">
                    <img src={imgLogo} alt="" className="img-logo" />
                    LinkUp
                </div>
                <Link to="/logIn">
                    <button className="empezar">Ingresar</button>
                </Link>
            </nav>

            <article className="slogan-img">
                <div className="info">
                    <h2>Ahora tu App de <br /> gestor de pago <br /> en Web</h2>
                    <p className="info-text">
                        <span className="color-acento">Dividir los gastos</span> debería ser fácil. Ya sea para un <br />
                        viaje en grupo, una noche con amigos o un hogar <br />
                        compartido, la <span className="color-acento"> web de seguimiento de gastos </span> de <br />
                        LinkUp hace que <span className="color-acento"> gestionar los gastos compartidos </span> <br />
                        sea sencillo.
                    </p>
                    <Link to="/signUp">
                        <button className="empezar">Registrarse ahora</button>
                    </Link>
                </div>
                <div className="container-img">
                    <img src={mobile} alt="Imagen de tarjetas" />
                </div>
            </article>

            <div className="separador">
                <h2>¿Cómo funciona?</h2>
            </div>

            <div className="gestionar">
                <div className="ges-img">
                    <img src={creacion} 
                    style={{ height: '50%' }}/>
                </div>
                <div className="ges-info">
                    <h2>Crea tus grupos</h2>
                    <ul className="custom-list">
                        <li>Personaliza cada grupo con un nombre y una imagen para identificarlo fácilmente. Ideal para viajes, compañeros de piso o cualquier gasto compartido.</li>
                        <li>Envía la invitación a tus amigos de forma rápida para que se unan al grupo y empiecen a registrar gastos sin complicaciones.</li>
                        <li>Administra tus grupos con facilidad: añade o elimina integrantes y borra el grupo cuando ya no lo necesites.</li>
                    </ul>
                </div>
            </div>

            <div className="gestionar2">
                <div className="ges-img">
                    <img src={añadir} 
                     style={{ transform: 'perspective(500px) rotateY(-10deg)', height: '65%' }} />
                </div>
                <div className="ges-info">
                    <h2>Añade tus gastos</h2>
                    <ul className="custom-list">
                        <li>Añade un título, el importe y quién lo pagó en segundos.</li>
                        <li>Sube una foto del recibo para llevar un mejor control.</li>
                        <li>Asigna los costos a las personas que elijas de forma sencilla.</li>
                    </ul>
                </div>
            </div>

            <div className="gestionar">
                <div className="ges-img">
                    <img src={saldar} 
                    style={{ transform: 'perspective(500px) rotateY(10deg)', height: '65%' }} />
                </div>
                <div className="ges-info">
                    <h2>Salda las cuentas</h2>
                    <ul className="custom-list">
                        <li>Consulta en todo momento quién debe qué y a quién, con un desglose claro de los gastos.</li>
                        <li>Envía solicitudes de pago a tus amigos y marca las deudas como pagadas en un solo clic.</li>
                        <li>El sistema optimiza los pagos para que todos salden sus cuentas de la forma más sencilla posible.</li>
                    </ul>
                </div>
            </div>

            <footer className="footer-home">
                <div className="footer-container">
                    <div className="info">
                        <div className="ventajas">
                            <h3>Ventajas</h3>
                            <ul>
                                <li>Divide gastos del grupo</li>
                                <li>Seguimiento de gasto</li>
                                <li>Solicitudes de pago</li>
                            </ul>
                        </div>

                        <div className="ayuda">
                            <h3>Ayuda</h3>
                            <ul>
                                <li>Centro de ayuda</li>
                                <li>Contáctanos</li>
                                <li>FAQs</li>
                            </ul>
                        </div>

                        <div className="desarrollo">
                            <h3>Desarrollado por:</h3>
                            <ul>
                                <li>
                                    Arnau <a href="https://github.com/ArnauOliveras" target="_blank" style={{ color: 'white' }}><i class="fa-brands fa-github"></i></a> <a href="https://www.linkedin.com/in/arnauoliveras" target="_blank" style={{ color: '#0A66C2' }}> <i class="fa-brands fa-linkedin"></i></a>
                                </li>
                                <li>
                                    Domingo <a href="https://github.com/rzmsdo"  target="_blank" style={{ color: 'white' }}><i class="fa-brands fa-github"></i></a> <a href="https://www.linkedin.com/in/domirami/" target="_blank" style={{ color: '#0A66C2' }}> <i class="fa-brands fa-linkedin"></i></a>
                                </li>
                                <li>
                                    Nacho <a href="https://github.com/nachodev30" target="_blank" style={{ color: 'white' }}><i class="fa-brands fa-github"></i></a> <a href="https://www.linkedin.com/in/ignacio-r%C3%ADzquez-v%C3%A1zquez-883890262/" target="_blank" style={{ color: '#0A66C2' }}> <i class="fa-brands fa-linkedin"></i></a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="hr"></div>
                    
                    <div className="redes-term">
                        <div className="social">
                            <i className="fa-brands fa-linkedin"></i>
                            <i className="fa-brands fa-youtube" ></i>
                            <i className="fa-brands fa-instagram"></i>
                        </div>
                        <div className="copy">
                            <p>&copy; 2025 LinkUp</p>
                            <p>Términos y condiciones</p>
                            <p>Política de privacidad</p>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
};


export default Home