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
                <div className="row align-items-center g-0">

                    <div className="col sm-12 col-md-2 text-center ">
                        <img src={grupo[0].image} className="img-fluid rounded-start" alt="imagen" style={{ width: "70%", height: "70%", objectFit: "cover" }} />
                    </div>

                    <div className="col-sm-12 col-md-10">
                        <div className="text-center bg-c2 ">
                            <h3 className="fw-bold mb-0">{grupo[0].name}</h3>
                        </div>
                        <div className="col-sm-12 d-flex w-100 justify-content-between align-items-center">
                            <div className="d-block ms-5">
                                <p className="mb-1"><strong>Participantes:</strong> {grupo[0].people}</p>
                                <p className="m-0"> <strong>Te deben:</strong> {grupo[0].deben}€ <strong>Debes: </strong>{grupo[0].debes}€</p>
                            </div>
                            <div className="d-block">
                                <p className="mb-1">Activo: <i className="fa-solid fa-square-check"></i></p>
                                <p className="mb-0">Fecha inicio: {grupo[0].fecha}</p>
                            </div>

                            <div className="col-md-2 d-flex flex-column align-items-center">
                                <button className="btn btn1 text-c5 btn-sm mt-1">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                                <button className="btn btn2 text-c5 btn-sm mt-1 mb-1">
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