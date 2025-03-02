import React from "react";
import "../../styles/index.css";

export const EditExpense = ({ expense, onDeleteExpense  }) => {
    return (
        <div className="modal fade" id="editExpenseModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content bg-c3 modal-rounded p-3">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <h2 className=" text-light text-center flex-grow-1">
                            <strong>{expense?.title || "Sin título"}</strong>
                        </h2>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <p className="text-light text-center">Pagado el {expense?.date || "Fecha desconocida"}</p>

                    <div className="px-3">
                        <p className="text-light text-start">Pagado por</p>
                        <div className="bg-c2 d-flex align-items-center justify-content-between rounded px-3 mb-4 border-c2">
                            <div className="d-flex align-items-center p-2 rounded">
                                {/*<img
                                    src={expense?.imageURL}
                                    alt={expense?.paidFor || "Usuario"}
                                    className="rounded-circle me-2"
                                    width="40"
                                    height="40"
                                />*/}
                                <h4 className="text-light m-0"><i className="fa-solid fa-user pe-2 text-light"></i>{expense?.paidFor || "Desconocido"} </h4>
                            </div>
                            <h4 className="text-light mt-3 text-center">{expense?.amount || "0"} €</h4>
                        </div>
                    </div>

                    <p className="text-light text-start px-3">Balance</p>
                    <div className="px-3 balance-container">
                        {expense?.balance?.map(({ name, amount }, index) => (
                            amount !== 0 && (
                                <div key={index} className="border-bottom border-2 d-flex align-items-center justify-content-between px-3 mb-1">
                                    <div className="d-flex align-items-center p-2 rounded">
                                        <i className="fa-solid fa-user pe-2 text-light"></i>
                                        <h5 className="text-light m-0">{name || "Desconocido"}</h5>
                                    </div>
                                    <h5 className="text-light mt-3 text-center">{amount} €</h5>
                                </div>
                            )
                        ))}
                    </div>

                    <div className="p-3 d-flex justify-content-center">
                        <button className="btn btn-outline-danger mx-2" data-bs-dismiss="modal" onClick={onDeleteExpense}><i className="fa-regular fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
};
