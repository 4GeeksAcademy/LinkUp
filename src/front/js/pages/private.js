import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { BaseListGroups } from "../component/baseListGroups";
import "../../styles/private.css";


export const Private = () => {
    const Nombredelgrupo = "Debug"
    const { store, actions } = useContext(Context);
    const listgroups = store.groups;
    console.log(listgroups);
    

    return (
        <div className="container-floid h-100 d-flex justify-content-between">
            <div className="barlat bg-c3 d-block ">
                <div className="bg-c2 rounded text-center  m-3 d-flex justify-content-between">

                    <div className="d-flex justify-content-center w-100">
                        <h3 className="text-c5 pb-1 mt-1">Tus grupos</h3>
                     </div>
                    
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle mt-1 me-1 text-c1 bg-c5" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa-solid fa-users-rectangle"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end bg-c5 text-c1 drp">
                            <li><a className="dropdown-item" href="#">Crear un grupo</a></li>
                            <li><a className="dropdown-item" href="#">Unirme a un grupo</a></li>
                            
                        </ul>
                    </div>
                </div>
                <div className="mx-3 d-block align-items-center">
                 <BaseListGroups/>   
                 <BaseListGroups/>  
                 <BaseListGroups/>  
                </div>
                

            </div>
            <div className="divCuerpo bg-c3 container-floid d-block">
                <div className="containesr-fluid contitle bg-c3">
                <div className="mt-3 ms-3 text-c5 bg-c2 d-flex justify-content-center titleName rounded">
                    <h3 className="text-center">Novedades de los grupos</h3>
                </div></div>
                <div className="d-block justify-content-around text-c5 mt-5">
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                </div>
            </div>
        </div>
    );
};