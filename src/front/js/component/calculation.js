import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import { Link } from "react-router-dom";

export const Calculation = ({ theid, onChangeView }) => {
    const { store, actions } = useContext(Context);
    const [group, setGroup] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchGroup = async () => {
            const fetchedGroup = await actions.getGroup(theid);
            setGroup(fetchedGroup);
        };
        fetchGroup();
    }, [theid, actions]);

    // Calcular los balances
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

    const calculateTransactions = (balances) => {
        const deudores = [];
        const acreedores = [];

        for (const [persona, saldo] of Object.entries(balances)) {
            if (saldo < 0) {
                deudores.push([persona, Math.abs(saldo)]);
            } else if (saldo > 0) {
                acreedores.push([persona, saldo]);
            }
        }

        const transacciones = [];
        for (let i = 0; i < deudores.length; i++) {
            let [deudor, deuda] = deudores[i];
            for (let j = 0; j < acreedores.length; j++) {
                let [acreedor, credito] = acreedores[j];
                if (deuda === 0) break;
                if (credito === 0) continue;

                const amount = Math.min(deuda, credito);
                transacciones.push({
                    whoPays: deudor,
                    amount: amount,
                    toWho: acreedor
                });

                deuda -= amount;
                credito -= amount;

                if (deuda === 0) deudores[i][1] = 0;
                if (credito === 0) acreedores[j][1] = 0;
            }
        }
        return transacciones;
    };

    useEffect(() => {
        const balances = calculateBalances();
        const transacciones = calculateTransactions(balances);
        setTransactions(transacciones);
    }, [group]);

    return (
        <div className="mt-3 ms-3 bg-c2 group-detail">
            <div className="d-flex justify-content-between align-items-start">
                <button className="text-light btn button-no mt-3 ms-3 fs-4 text-start" onClick={onChangeView}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h2 className="text-light pt-3 bg-c3 px-5 rounded mt-3 pb-3">
                    <strong>Calculadora de <br />transacciones</strong>
                </h2>
                <div className="px-3"></div>
            </div>

            <div className="mx-4 mt-4">
                {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                        <p className="text-light" key={index}>
                            {transaction.whoPays} debe {transaction.amount} € a {transaction.toWho}
                        </p>
                    ))
                ) : (
                    <p>No hay transacciones pendientes.</p>
                )}
            </div>
        </div>
    );
};
