import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import "../../styles/balances.css";
import { Link } from "react-router-dom";

export const Balances = ({ theid, onChangeView }) => {
    const { actions } = useContext(Context);
    const [groupMembers, setGroupMembers] = useState([]);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const fetchedGroupMembers = await actions.getGroupMembers(theid);

                setGroupMembers(fetchedGroupMembers.members);
            } catch (error) {
                console.error("Error al obtener los miembros del grupo:", error);
                setGroupMembers([]);
            }
        };
        fetchGroup();


    }, [theid, actions]);

    return (
        <div className="flex-grow-1 m-3 bg-c2 group-detail">
            <h2 className="text-light pt-3">
                <strong className="bg-c3 px-5 rounded pb-1">Balances</strong>
            </h2>
            <button
                className="text-light pt-3 btn button-no btn-primary mt-3 pb-3"
                onClick={onChangeView}
            >
                Ver la calculadora de transacciones
            </button>
            <div className="mx-4 mt-4">
                {groupMembers.length != 0 ? (
                    groupMembers.map((member) => (
                        <div
                            key={member.name || Math.random()}
                            className="border-bottom border-2 d-flex align-items-center justify-content-between pt-2 pb-3 px-3 mb-1"
                        >
                            <div className="d-flex align-items-center rounded">
                                <i className="fa-solid fa-user pe-2 text-light"></i>
                                <h5 className="text-light m-0">{member.user_email === localStorage.getItem('email') ? member.name + " (yo)" : member.name || "Desconocido"}</h5>
                            </div>
                            <h5 className={`mt-3 text-center ${member.owes < 0 ? "text-danger" : member.owes !== 0 ? "text-info" : "text-success"}`}>
                                {member.owes !== undefined ? `${member.owes.toFixed(2)} €` : "0.00 €"}
                            </h5>
                        </div>
                    ))

                ) : (
                    <p className="text-light">Cargando balances...</p>
                )}
            </div>
        </div>
    );
};
