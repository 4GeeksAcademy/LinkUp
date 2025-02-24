import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import "../../styles/group.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export const Group = () => {
    const { store, actions } = useContext(Context);
    const { theid } = useParams();
    const [isHidden, setIsHidden] = useState(false);

    return (
        <div className="text-center">

            <button class="add-expense-button">
                <i class="fa-solid fa-plus"></i>
                <span class="button-text">Añadir gasto</span>
            </button>



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
                                <button className=" text-c5 btn"><i class="fa-solid fa-pen-to-square"></i></button>
                            </div>
                            <div></div>
                        </div>
                    </div>

                    <div className="group-main p-1">
                        <div className="ms-0 ms-sm-3">
                            <div className="d-flex flex-wrap " style={{ width: '100%' }}>
                                <div className="flex-grow-1 m-3 bg-c3 group-detail">
                                    <div>Div 1</div>
                                </div>
                                <div className="flex-grow-1 m-3 bg-c3 group-detail" >
                                    <div >Div 2</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
