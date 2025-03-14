import React, { useState, useContext, useEffect } from "react";
import "../../styles/baseListaGrupos.css";
import { Context } from "../store/appContext";
import barbacoa from "../../img/barbacoa.jpg"
import casa from "../../img/casa.jpg";
import cumpleInfantil from "../../img/cumpleInfantil.jpg";
import fiesta from "../../img/fiesta.jpg";
import viaje from "../../img/viaje.jpg";
import vacaciones from "../../img/vacaciones.jpg";


export const BaseListGroups = ({ datos, onDelete }) => {

    const icon = (icono) => icono.split('/').pop().split('.').slice(0, -1).join('.');
    const { store, actions } = useContext(Context);
    const [grupos, setGrupos] = useState()

    const images = {
        barbacoa,
        casa,
        cumpleInfantil,
        fiesta,
        viaje,
        vacaciones
    };
    const imageName = icon(datos.iconURL);
    const imageSrc = images[imageName] || barbacoa;

    const handleGroupView = () => {
        window.location.href = `/group/${datos.id}`;
    }

    return (
        <div className="container mt-auto mb-2 text-center">
            <div className="card baseGrupo p-0 bg-c4 text-white shadow">
                <div className="row align-items-center g-0 d-flex flex-wrap">
                    {/* Imagen del grupo */}
                    <div className="col-12 col-md-2 text-center mb-3 mb-md-0">
                        <img
                            src={imageSrc}
                            className="img-fluid rounded-start"
                            alt="imagen"
                            style={{ width: "70%", height: "70%", objectFit: "cover" }}
                        />
                    </div>

                    {/* Contenido principal */}
                    <div className="col-12 col-md-10">
                        <button className="btn text-light text-center bg-c2 p-2 " style={{width: "100%"}}  onClick={handleGroupView}>
                            <h3 className="fw-bold mb-2">{datos.name}</h3>
                        </button>
                        <div className="d-flex flex-column flex-md-row w-100 justify-content-between align-items-center">
                            <div className="text-start p-2">
                                <p className="mb-1">
                                    <strong>Participantes: {datos.membersList.length}</strong></p>


                            </div>
                            <div className="text-end p-2">
                                <p className="mb-1">
                                    Activo: <i className="fa-solid fa-square-check"></i>
                                </p>
                                <p className="mb-0">
                                    Fecha inicio: {datos.fecha || "12/03/2025"}
                                </p>
                            </div>
                            <div className="d-flex flex-md-column p-2">
                                <button
                                    className="btn btn-outline-danger text-danger btn-sm me-2 me-md-0"
                                    onClick={() => onDelete(datos.id)}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>

                                <button type="button" className="btn  btn-outline-primary text-primary btn-sm mt-md-2" data-bs-toggle="modal" data-bs-target={`#inviteModal-${datos.id}`}>

                                    <i className="fa-solid fa-share-nodes"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
};