import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'

export const Calculation = ({ theid, onChangeView }) => {
    const { store, actions } = useContext(Context);
    const [members, setMembers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [group, setGroup] = useState([]);
    const [emailSend, setEmailSend] = useState("");
    const [trWhoPays, setTrWhoPays] = useState("");
    const [reminderAmount, setReminderAmount] = useState();
    const [defaultEmail, setDefaultEmail] = useState("");



    const fetchMembers = async () => {
        const fetchedMembers = await actions.getGroupMembers(theid);
        setMembers(fetchedMembers.members || []);
    };

    useEffect(() => {
        const fetchGroup = async () => {
            const fetchedGroup = await actions.getGroup(theid);

            setGroup(fetchedGroup);
            await fetchMembers();
        };
        fetchGroup();
        
    }, [theid]);
    console.log(members);

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };
    const groupId = theid;


   

    useEffect(() => {
        if (members.length > 0) {
            calculateTransactions(members);
        }
    }, [members]);


    const handleOpenModal = (transaction) => {
        setTrWhoPays(transaction.whoPays);
        setReminderAmount(transaction.amount);
    
        const memberData = members.find(member => member.name === transaction.whoPays);
    
        if (memberData?.user_email) {
            setDefaultEmail(memberData.user_email);
            setEmailSend(memberData.user_email);
        } else {
            setDefaultEmail("");
            setEmailSend("");
        }
    };

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


    const emailtoSend = async () => {
        const emailUser = members.find(member => member.name === trWhoPays);
    
        if (emailUser?.user_email) {
            setEmailSend(emailUser.user_email);
        } else if (!validateEmail(emailSend)) {
            console.log('No tiene un email registrado válido.');
            return;
        }
    
        const result = await actions.reminderUser(
            emailSend, 
            groupId,
            reminderAmount,
            trWhoPays,            
            group.name
        );
    
        if (result.success) {
            Swal.fire({
                title: "¡Correo enviado con éxito!",
                icon: "success",
                draggable: true
            });
            setEmailSend(""); 
        } else {
            Swal.fire({
                title: "¡Fallo al enviar el email!",
                icon: "error",
                draggable: true
            });
        }
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

                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#Modal-${transaction.whoPays}`} onClick={() => handleOpenModal(transaction)}>Solicitar</button>
                            </div>
                            {/* modal solicitar */}
                            <div className="modal fade" id={`Modal-${transaction.whoPays}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                               
                                
                                <div className="modal-dialog">
                                    <div className="modal-content bg-c4">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5 text-c5" id="exampleModalLabel">Copia del email que se enviara a {transaction.whoPays}</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body bg-c4">
                                            <form>
                                                {/* <div className="mb-3">
                                                    <label for="recipient-name" className="col-form-label">Remitente:</label>
                                                    <input type="text" className="form-control" id="recipient-name" placeholder={store.actualGroupMemberName} disabled />
                                                </div> */}
                                                <div className="mb-3">
                                                    <label htmlFor="message-text" className="col-form-label text-c5">Mensaje:</label>
                                                    <p className="form-control text-start bg-c3 text-white" id="message-text">
                                                        <label>¡Hola {transaction.whoPays}!</label>
                                                        <p>Queríamos recordarte que en el grupo {group.name} se han registrado nuevos gastos, y tu parte correspondiente es de {transaction.amount}.</p>

                                                        <p>Para facilitar la gestión del grupo, te agradeceríamos que realices el pago a la brevedad posible.</p>
                                                        <p> Si tienes alguna duda sobre los detalles del cálculo, entra en tus grupos y el grupo de {group.name} donde encontrarás más información.</p>
                                                        <p>Puedes ver un desglose completo de los gastos en la plataforma de LinkUP.</p>

                                                        <p>¡Gracias por tu colaboración!</p>

                                                        <p>Saludos,</p>
                                                        <p>El equipo de LinkUP</p>


                                                    </p>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="recipient-name" className="col-form-label text-c5">Direccion email</label>
                                                    <input
                                                     type="text"
                                                     className="form-control"
                                                     id="recipient-name"
                                                     placeholder={defaultEmail || "Introduce el email a quien va dirigido"}
                                                     value={emailSend}
                                                     onChange={(e) => {
                                                        if (!defaultEmail) {  
                                                            setEmailSend(e.target.value);
                                                        }
                                                    }}
                                                    disabled={!!defaultEmail} 
                                                 />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-outline-dark" data-bs-dismiss="modal">Cancelar</button>
                                            <button type="button" className="btn btn-outline-light"
                                                onClick={emailtoSend}
                                                disabled={!emailSend || !validateEmail(emailSend)}
                                                data-bs-dismiss="modal">
                                                Enviar email
                                            </button>
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