import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import "../../styles/balances.css";
import { Link } from "react-router-dom";

export const Balances = ({ theid, onChangeView }) => {
    const { actions } = useContext(Context);
    const [group, setGroup] = useState(null);

    useEffect(() => {
        const fetchGroup = async () => {
            const fetchedGroup = await actions.getGroup(theid);
            setGroup(fetchedGroup);
        };
        fetchGroup();
    }, [theid, actions]);

    const calculateBalances = () => {
        if (!group || !group.expensesList) return {};

        const balanceMap = {};

        group.expensesList.forEach(expense => {
            let { paidFor, amount, balance } = expense;

            amount = parseFloat(amount);
            if (isNaN(amount)) {
                console.error(`Error: amount inválido en`, expense);
                return;
            }

            if (!balanceMap[paidFor]) balanceMap[paidFor] = 0;
            balanceMap[paidFor] += amount;

            balance.forEach(entry => {
                let entryAmount = parseFloat(entry.amount);

                if (isNaN(entryAmount)) {
                    console.error(`Error: entry.amount inválido en`, entry);
                    return;
                }

                if (!balanceMap[entry.name]) balanceMap[entry.name] = 0;
                balanceMap[entry.name] -= entryAmount;
            });
        });

        return balanceMap;
    };

    const balances = calculateBalances();



    return (
        <div className="flex-grow-1 m-3 bg-c2 group-detail">
            <h2 className="text-light pt-3"><strong className="bg-c3 px-5 rounded pb-1">Balances</strong></h2>
            <button className="text-light pt-3 btn button-no btn-primary mt-3 pb-3" onClick={onChangeView}>Ver la calculadora de transacciones</button>
            <div className="mx-4 mt-4">
                {group ? (
                    Object.entries(balances).map(([name, amount]) => (
                        <div key={name} className="border-bottom border-2 d-flex align-items-center justify-content-between px-3 mb-1">
                            <div className="d-flex align-items-center p-2 rounded">
                                <i className="fa-solid fa-user pe-2 text-light"></i>
                                <h5 className="text-light m-0">{name || "Desconocido"}</h5>
                            </div>
                            <h5 className={`mt-3 text-center ${amount < 0 ? "text-danger" : "text-c5"}`}>
                                {amount} €
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
