import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import { Link } from "react-router-dom";

export const Calculation = ({ theid, onChangeView }) => {
    const { store, actions } = useContext(Context);
    const [members, setMembers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [group,setGroup]= useState([]);

    useEffect(() => {  
        const fetchGroup = async () => {
        const fetchedGroup = await actions.getGroup(theid);
            
            setGroup(fetchedGroup);
    };
    fetchGroup();
        fetchMembers();
    }, [theid, actions]);
    console.log(members);
    

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
                        amount: amountToReceive,
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
                                <strong>{transaction.whoPays === store.actualGroupMemberName ? transaction.whoPays + " (yo)" : transaction.whoPays}</strong> debe <strong className="text-c5">{transaction.amount}</strong> € a <strong>{transaction.toWho === store.actualGroupMemberName ? transaction.toWho + " (yo)" : transaction.toWho}</strong>
                            </p>
                            <div className="btn-group" role="group">
                                <button type="button" className="btn btn-light" onClick={() => handleMarkAsPaid(transaction)}>Marcar como pagado</button>
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#Modal-${transaction.whoPays}`} data-bs-whatever="@mdo">Solicitar</button>
                            </div>
                {/* modal solicitar */}
                            <div className="modal fade" id={`Modal-${transaction.whoPays}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Enviar mensaje a {transaction.whoPays}</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form>
                                                <div className="mb-3">
                                                    <label for="recipient-name" className="col-form-label">Remitente:</label>
                                                    <input type="text" className="form-control" id="recipient-name" placeholder={store.actualGroupMemberName} disabled/>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="message-text" className="col-form-label">Mensaje:</label>
                                                    <textarea className="form-control" id="message-text">
                                                        <label>¡Hola!</label>
                                                        <label>Desde LinkUP, {store.actualGroupMemberName} del grupo {group.name}</label>
                                                        

                                                    </textarea>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                            <button type="button" className="btn btn-primary">Enviar mensaje</button>
                                        </div>
                                    </div>
                                </div>
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