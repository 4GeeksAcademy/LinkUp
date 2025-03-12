import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import { Link } from "react-router-dom";

export const Calculation = ({ theid, onChangeView }) => {
    const { store, actions } = useContext(Context);
    const [members, setMembers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchMembers();
    }, [theid, actions]);

    const fetchMembers = async () => {
        const fetchedMembers = await actions.getGroupMembers(theid);
        setMembers(fetchedMembers.members || []);
    };

    useEffect(() => {
        if (members.length > 0) {
            calculateTransactions(members);
        }
    }, [members]);

    const calculateTransactions = (members) => {
        let creditors = members.filter(member => member.owes < 0);
        let debtors = members.filter(member => member.owes > 0);
        let transactions = [];

        debtors.forEach(debtor => {
            let amountToPay = debtor.owes;

            creditors.forEach(creditor => {
                if (amountToPay > 0 && creditor.owes < 0) {
                    let amountToReceive = Math.min(amountToPay, -creditor.owes);
                    transactions.push({
                        whoPays: debtor.name,
                        toWho: creditor.name,
                        amount: amountToReceive.toFixed(2),
                        date: new Date().toLocaleDateString("en-GB").split("/").join("-"),
                    });

                    amountToPay -= amountToReceive;
                    creditor.owes += amountToReceive;
                }
            });
        });

        setTransactions(transactions);
    };


    const handleMarkAsPaid = (e) => {
        console.log(e);
        const fetchPayMember = async () => {
            const fetchedPayMember = await actions.payMember(e, theid);
            console.log(fetchedPayMember);
            fetchMembers();

            window.location.href = `/group/${theid}`;
        };
        fetchPayMember();
    };

    return (
        <div className="flex-grow-1 m-3 bg-c2 group-detail">
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
                        <div className="border-bottom border-2 pt-2 flex-column pb-3" key={index}>
                            <p className="text-light">
                                <strong>{transaction.whoPays}</strong> debe <strong className="text-c5">{transaction.amount}</strong> € a <strong>{transaction.toWho}</strong>
                            </p>
                            <div className="btn-group" role="group">
                                <button type="button" className="btn btn-light" onClick={() => handleMarkAsPaid(transaction)}>Marcar como pagado</button>
                                <button type="button" className="btn btn-primary">Solicitar</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="border-bottom border-2 text-light py-3">No hay transacciones pendientes.</p>
                )}
            </div>
        </div>
    );
};