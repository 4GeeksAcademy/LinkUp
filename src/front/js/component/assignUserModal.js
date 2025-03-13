import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import "../../styles/newExpense.css";

export const AssignUserModal = ({ theid }) => {
    const { store, actions } = useContext(Context);
    const [membersList, setMembersList] = useState([]);
    const [member, setMember] = useState("");
    const [memberID, setMemberID] = useState(null);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const fetchedGroupMembers = await actions.getGroupMembers(theid);
                setMembersList(fetchedGroupMembers.members);

                if (fetchedGroupMembers.members.length > 0) {
                    handleSelectMember(fetchedGroupMembers.members[0]);
                }
            } catch (error) {
                console.error("Error al obtener los miembros del grupo:", error);
            }
        };
        fetchGroupMembers();
    }, [theid, actions]);

    const handleSelectMember = (member) => {
        setMember(member.name);
        setMemberID(member.id);
    };

    const handleAssignMember = (memberID) => {
        const fetchAssignMember = async () => {
            try {
                const response = await actions.assignUser(memberID);
                console.log(response);

                window.location.href = `/group/` + theid;
            } catch (error) {
                console.error("Error al asignar el miembro:", error);
            }
        };
        fetchAssignMember();
    };

    return (
        <div className="modal fade" id="assignUserModal" tabIndex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content bg-c3 modal-rounded">
                    <div className="d-flex align-items-center justify-content-center pt-3">
                        <h1 className="fs-3 pt-2 text-c5"><strong>Bienvenido al grupo</strong></h1>
                    </div>
                    <div className="d-flex align-items-center justify-content-center pt-3">
                        <p className="text-light">Elige el miembro que eres para facilitar la estancia en el grupo.</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-center pt-3">
                        <div className="btn-group-vertical w-75" role="group" aria-label="Vertical radio toggle button group">
                            {Array.isArray(membersList) && membersList.length > 0 ? (
                                membersList.map((member) => (
                                    <React.Fragment key={member.id}>
                                        <input
                                            type="radio"
                                            className="btn-check"
                                            name="vbtn-radio"
                                            id={'vbtn-radio' + member.id}
                                            autoComplete="off"
                                            checked={memberID === member.id}
                                            onChange={() => handleSelectMember(member)}
                                        />
                                        <label className="btn btn-secondary" htmlFor={'vbtn-radio' + member.id}>
                                            {member.name}
                                        </label>
                                    </React.Fragment>
                                ))
                            ) : (
                                <p className="text-light text-center">No te puedes unir a este grupo, no quedan plazas.</p>
                            )}
                        </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-center pt-4 pb-5">
                        <button type="button" className="btn btn-primary" onClick={() => handleAssignMember(memberID)}>
                            Guardar como {member}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
