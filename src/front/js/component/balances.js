import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import "../../styles/balances.css";
import { Link } from "react-router-dom";

export const Balances = () => {
    const { store, actions } = useContext(Context);
    

    return (
        <div className="flex-grow-1 m-3 bg-c2 group-detail">
            <h2>Balances</h2>
            <div className="mx-4 mt-4">

            </div>
        </div>
    );
};
