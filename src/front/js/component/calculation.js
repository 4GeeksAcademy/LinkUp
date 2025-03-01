import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import { Link } from "react-router-dom";

export const Calculation = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="flex-grow-1 m-3 bg-c2 group-detail">
            <h2>Calculadora de transacciones</h2>
            <div className="mx-4 mt-4">

            
            </div>
        </div>
    );
};
