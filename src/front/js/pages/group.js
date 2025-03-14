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
import { AssignUserModal } from "../component/assignUserModal.js";

export const Group = () => {
    const { store, actions } = useContext(Context);
    const { theid } = useParams();
    const [isHidden, setIsHidden] = useState(false);
    const [showBalances, setShowBalances] = useState(true);
    const [group, setGroup] = useState(null);
    const [groupNotFound, setGroupNotFound] = useState(false);
    const [groupMembers, setGroupMembers] = useState([]);
    const [listGroups, setListGroups] = useState([])

    useEffect(() => {
        const modalElement = document.getElementById("assignUserModal");
        if (modalElement) {
            const modalInstance = new bootstrap.Modal(modalElement);
            const fetchGroupMembers = async () => {
                try {
                    const fetchedGroupMembers = await actions.getGroupMembers(theid);

                    let alreadyAssigned = false;

                    fetchedGroupMembers.members.forEach(member => {
                        if (member.user_email === localStorage.getItem('email')) {
                            alreadyAssigned = true;
                        }
                    });

                    if (!alreadyAssigned) {
                        modalInstance.show();
                    }

                } catch (error) {
                    console.error("Error al obtener los miembros del grupo:", error);
                }
            };
            fetchGroupMembers();
        }
    }, [group]);


    useEffect(() => {
        const fetchGroup = async () => {
            const fetchedGroup = await actions.getGroup(theid);
            if (fetchedGroup.status === 404) {
                setGroupNotFound(true);
            }
            else
                setGroup(fetchedGroup);
        };
        fetchGroup();

        const fetchGroupMembers = async () => {
            try {
                const fetchedGroupMembers = await actions.getGroupMembers(theid);
                setGroupMembers(fetchedGroupMembers.members);
            } catch (error) {
                console.error("Error al obtener los miembros del grupo:", error);
                setGroupMembers([]);
            }
        };
        fetchGroupMembers();

        const fetchGroups = async () => {
            const data = await actions.getGroups();

            if (data && data.groups) {
                setListGroups(data.groups);
            }
        };
        fetchGroups();

    }, [theid, actions]);

    const handleGoToGroup = (idGroup) => {
        window.location.href = `/group/` + idGroup;
    };

    return (
        <div className="text-center group">
            {group ? (
                <>
                    <button className="add-expense-button">
                        <i className="fa-solid fa-plus"></i>
                        <span className="button-text" data-bs-toggle="modal" data-bs-target="#newExpenseModal">Añadir gasto</span>
                    </button>
                    <NewExpense theid={theid} />
                    <EditGroup theid={theid} />
                    <AssignUserModal theid={theid} />
                </>
            ) : ""}

            <div className="d-flex" style={{ height: "100vh" }}>
                <div className={`group-left ${isHidden ? "hidden" : "p-1"} d-none d-md-block`}>
                    <button onClick={() => setIsHidden(!isHidden)} className="close-left-button text-c5">
                        <strong>
                            {isHidden ? <i className="fa-solid fa-arrow-right"></i> : <i className="fa-solid fa-arrow-left"></i>}
                        </strong>
                    </button>
                    <div className="d-flex flex-column justify-content-center" style={{ maxHeight: '100%' }}>

                        <div className="mt-5 pt-3"></div>
                        <h3 className="text-c5 mt-4 group-grouplisttitle mx-5 pb-2">Groups list</h3>
                        <div className="d-flex flex-column justify-content-center align-items-center pt-5" style={{ overflowY: 'auto' }}>
                            {listGroups.map((group, index) => (
                                <button key={index} className="btn group-list-content d-flex align-items-center justify-content-between gap-2 p-0 my-2 bg-c2" onClick={() => handleGoToGroup(group.id)}>
                                    <img
                                        src={group.iconURL}
                                        alt={group.name}
                                        className="group-image p-0 m-0"
                                    />
                                    <span className="text-lg font-semibold text-light"><strong>{group.name}</strong></span>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </button>
                            ))}
                        </div>






                    </div>

                </div>



                <div className={`group-left-ghost ${isHidden ? "hidden" : "p-1"} d-none d-md-block`}>

                </div>

                {group ? (
                    <>
                        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                            <div className="navbar bg-c4 group-top p-1">
                                <div className="container-fluid">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={group.iconURL}
                                            alt="Company Logo"
                                            className="rounded-circle me-3"
                                            width="50"
                                            height="50"
                                        />
                                        <div className="d-flex flex-column">
                                            <div className="d-flex align-items-center">
                                                <span className="navbar-brand mb-0 h1 text-c5">{group.name}</span>
                                                <button className=" text-c5 btn" data-bs-toggle="modal" data-bs-target="#editGroupModal">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                            </div>
                                            <div style={{ display: "inline-block", width: "auto", maxWidth: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                <p className="text-light" style={{ margin: 0, display: "inline-block", maxWidth: "100%" }}>
                                                    {groupMembers.map((member, index) => (
                                                        <span key={index}>
                                                            {member.name}
                                                            {index < groupMembers.length - 1 && ", "}
                                                        </span>
                                                    ))}
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                    <Link to="/private">
                                        <i className="fa-solid fa-house-user text-light fs-3"></i>
                                    </Link>
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
                    </>
                ) : (
                    <>
                        {groupNotFound ? (
                            <>
                                <h1 className="p-5">Error 404 group not found</h1>
                            </>
                        ) : (
                            <>
                                <h1 className="p-5">Loading...</h1>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
