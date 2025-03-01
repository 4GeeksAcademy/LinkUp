import React from "react";
import "../../styles/index.css";

export const ImagenAmpliadaModal = ({ imageURL }) => {
    return (
        <div className="modal fade" id="imagenAmpliadaModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-3 overflow-hidden">
                    {/* Botón de cerrar con fondo */}
                    <div className="position-absolute top-0 end-0 m-2">
                        <button 
                            type="button" 
                            className="btn-close p-2 rounded-circle bg-dark bg-opacity-50"
                            data-bs-dismiss="modal" 
                            aria-label="Close"
                        ></button>
                    </div>
                    <img src={imageURL} alt="imagen ampliada" className="w-100 h-100 object-fit-cover" />
                </div>
            </div>
        </div>
    );
};
