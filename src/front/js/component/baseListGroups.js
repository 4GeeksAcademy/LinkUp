import React, { useState, useContext } from "react";
import "../../styles/baseListaGrupos.css";
import { Context } from "../store/appContext";
import barbacoa from "../../img/barbacoa.jpg";
import casa from "../../img/casa.jpg";
import cumpleInfantil from "../../img/cumpleInfantil.jpg";
import fiesta from "../../img/fiesta.jpg";
import viaje from "../../img/viaje.jpg";
import vacaciones from "../../img/vacaciones.jpg";
import Swal from 'sweetalert2'


export const BaseListGroups = ({ datos, onDelete }) => {
    const { store, actions } = useContext(Context);
    const [emailInvitate, setEmailInvitate] = useState("");
    const [error, setError] = useState("");

    const icon = (icono) => icono.split("/").pop().split(".").slice(0, -1).join(".");
    const images = { barbacoa, casa, cumpleInfantil, fiesta, viaje, vacaciones };
    const imageName = icon(datos.iconURL);
    const imageSrc = images[imageName] || barbacoa;

    const handleGroupView = () => {
        window.location.href = `/group/${datos.id}`;
    };

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleInvite = async () => {
        if (!emailInvitate) {
            setError("Por favor, introduce un correo válido.");
            return;
        }

        const result = await actions.inviteUser(emailInvitate, datos.id);

        if (result.success) {
            Swal.fire({
                title: "¡Correo enviado con éxito!",
                icon: "success",
                draggable: true
            });
            setEmailInvitate("");
        } else {
            setError(result.message);
            Swal.fire({
                title: "¡Fallo al enviar el email!",
                icon: "error",
                draggable: true
            });
        }
    };


    return (
        <div className="container mt-auto mb-2 text-center">
            <div className="card baseGrupo p-0 bg-c4 text-white shadow">
                <div className="row align-items-center g-0 d-flex flex-wrap">
                    <div className="col-12 col-md-2 text-center mb-3 mb-md-0">
                        <img
                            src={imageSrc}
                            className="img-fluid rounded-start"
                            alt="imagen"
                            style={{ width: "70%", height: "70%", objectFit: "cover" }}
                        />
                    </div>

                    <div className="col-12 col-md-10">
                        <button className="btn text-light text-center bg-c2 p-2 w-100" onClick={handleGroupView}>
                            <h3 className="fw-bold mb-2">{datos.name}</h3>
                        </button>
                        <div className="d-flex flex-column flex-md-row w-100 justify-content-between align-items-center">
                            <div className="text-start p-2">
                                <p className="mb-1"><strong>Participantes: {datos.membersList.length}</strong></p>
                            </div>
                            <div className="text-end p-2">
                                <p className="mb-1">Activo: <i className="fa-solid fa-square-check"></i></p>
                                <p className="mb-0">Fecha inicio: {datos.fecha || "12/03/2025"}</p>
                            </div>
                            <div className="d-flex flex-md-column p-2">
                                <button className="btn btn-outline-danger text-danger btn-sm me-2 me-md-0"
                                    onClick={() => onDelete(datos.id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>

                                <button type="button" className="btn btn-outline-primary text-primary btn-sm mt-md-2"
                                    data-bs-toggle="modal" data-bs-target={`#inviteModal-${datos.id}`}>
                                    <i className="fa-solid fa-share-nodes"></i>
                                </button>
                            </div>

                            <div className="modal fade" id={`inviteModal-${datos.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`inviteModalLabel-${datos.id}`} aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content bg-c4 text-c5">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id={`inviteModalLabel-${datos.id}`}>Invitar a una nueva persona al grupo</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body text-white">
                                            <p>Para añadir a una nueva persona al grupo y permitirle compartir o añadir gastos al evento, introduce su correo electrónico.</p>
                                            <p>Esta persona recibirá un enlace que la redirigirá al acceso del grupo. Al ingresar, deberá identificarse en el listado disponible, un requisito indispensable para unirse.</p>
                                            <p>Por favor, introduce la dirección de correo de la persona que deseas añadir al grupo:</p>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Correo electrónico"
                                                value={emailInvitate}
                                                onChange={(e) => {
                                                    setEmailInvitate(e.target.value);
                                                    setError("");
                                                }}
                                            />
                                            {error && <p className="text-danger mt-2">{error}</p>}
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-outline-dark" data-bs-dismiss="modal">Cancelar</button>
                                            <button type="button" className="btn btn-outline-light"
                                                onClick={handleInvite}
                                                disabled={!emailInvitate || !validateEmail(emailInvitate)}
                                                data-bs-dismiss="modal">
                                                Realizar invitación
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
