import React, { useState, useContext, useEffect } from "react";
import "../../styles/baseListaGrupos.css";
import { Context } from "../store/appContext";
import barbacoa from "../../img/barbacoa.jpg"

export const BaseListGroups = ({ datos }) => {

    const { store, actions } = useContext(Context);
    const [grupos, setGrupos] = useState()
    const grupo = [{
        image: barbacoa,
        name: "Barbacoa",
        people: 9,
        deben: 25,
        debes: 35,
        fecha: "25/02/2025"
    }]






    return (
        <div className="container mt-auto mb-2 text-center">
    <div className="card baseGrupo p-0 bg-c4 text-c5 shadow">
        <div className="row align-items-center g-0 d-flex flex-wrap">
            {/* Imagen del grupo */}
            <div className="col-12 col-md-2 text-center mb-3 mb-md-0">
                <img
                    src={grupo[0].image}
                    className="img-fluid rounded-start"
                    alt="imagen"
                    style={{ width: "70%", height: "70%", objectFit: "cover" }}
                />
            </div>

            {/* Contenido principal */}
            <div className="col-12 col-md-10">
                <div className="text-center bg-c2 p-2">
                    <h3 className="fw-bold mb-2">{grupo[0].name}</h3>
                </div>
                <div className="d-flex flex-column flex-md-row w-100 justify-content-between align-items-center">
                    <div className="text-start p-2">
                        <p className="mb-1">
                            <strong>Participantes:</strong> {grupo[0].people}
                        </p>
                        <p className="m-0">
                            <strong>Te deben:</strong> {grupo[0].deben}€ | <strong>Debes:</strong> {grupo[0].debes}€
                        </p>
                    </div>
                    <div className="text-end p-2">
                        <p className="mb-1">
                            Activo: <i className="fa-solid fa-square-check"></i>
                        </p>
                        <p className="mb-0">
                            Fecha inicio: {grupo[0].fecha}
                        </p>
                    </div>
                    <div className="d-flex flex-md-column p-2">
                        <button className="btn btn1 text-c5 btn-sm me-2 me-md-0">
                            <i className="fa-solid fa-trash"></i>
                        </button>
                        <button className="btn btn2 text-c5 btn-sm mt-md-2">
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