import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import "../../styles/group.css";
import { Link, useParams } from "react-router-dom";

import { NewExpense } from "../component/newExpense.js";
import { EditGroup } from "../component/editGroup.js";
import { Balances } from "../component/balances.js";
import { Expenses } from "../component/expenses.js";
import { Calculation } from "../component/calculation.js";

export const Group = () => {
    const { store, actions } = useContext(Context);
    const [isDebug, setIsDebug] = useState(false);
    const { theid } = useParams();
    const [isHidden, setIsHidden] = useState(false);
    const [showBalances, setShowBalances] = useState(true);

    useEffect(() => {
        if (isDebug) {
            const modalElement = document.getElementById("newExpenseModal");
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        }
        console.log(actions.getGroup(theid));
    }, []);

    return (
        <div className="text-center">
            <button className="add-expense-button">
                <i className="fa-solid fa-plus"></i>
                <span className="button-text" data-bs-toggle="modal" data-bs-target="#newExpenseModal">Añadir gasto</span>
            </button>

            <NewExpense membersList={actions.getGroup(theid).membersList} theid={theid} />
            <EditGroup theid={theid} />

            <div className="d-flex" style={{ height: "100vh" }}>
                <div className={`group-left ${isHidden ? "hidden" : "p-1"} d-none d-md-block`}>
                    <button onClick={() => setIsHidden(!isHidden)} className="close-left-button text-c5">
                        <strong>
                            {isHidden ? <i className="fa-solid fa-arrow-right"></i> : <i className="fa-solid fa-arrow-left"></i>}
                        </strong>
                    </button>
                    {!isHidden ? (
                        <>
                            <h3 className="text-c5 mt-4 ms-2">Groups list</h3>
                        </>
                    ) : ""}
                </div>

                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div className="navbar bg-c4 group-top p-1">
                        <div className="container-fluid">
                            <Link to="/private">
                                <i className="fa-solid fa-arrow-left text-c5 fs-3"></i>
                            </Link>
                            <div className="d-flex align-items-center">
                                <span className="navbar-brand mb-0 h1 text-c5">Group with ID {theid}</span>
                                <button className=" text-c5 btn" data-bs-toggle="modal" data-bs-target="#editGroupModal"><i className="fa-solid fa-pen-to-square"></i></button>
                            </div>
                            <div></div>
                        </div>
                    </div>

                    <div className="group-main p-1">
                        <div className="ms-0 ms-sm-3">
                            <div className="d-flex flex-wrap " style={{ width: '100%' }}>
                                <Expenses theid={theid} />
                                {showBalances ? <Balances theid={theid} onChangeView={() => setShowBalances(false)} /> : <Calculation theid={theid} onChangeView={() => setShowBalances(true)} />}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
