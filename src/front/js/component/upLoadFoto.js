import React, { useContext, useState } from 'react';
import "../../styles/uploadImages.css";
import { Context } from '../store/appContext';

export const UploadFoto = () => {
    const { store, actions } = useContext(Context);
    const [imageSelected, setImageSelected] = useState(null);

    const handleSelectImage = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageSelected(file);
        }
    };

    const handleUploadImage = () => {
        if (imageSelected) {
            actions.uploadImage(imageSelected);
            setImageSelected(null);
        }
    };

    const handleCancel = () => {
        setImageSelected(null); 
    };

    return (
        <div>
            <button type="button" id="botonModal" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editGroupModal">
                Subir imagen
            </button>

            <div className="modal fade" id="editGroupModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editGroupModal">Subir imagen</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input id="botonModal2" type="file" accept="image/*" onChange={handleSelectImage} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleCancel}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal" disabled={!imageSelected} onClick={handleUploadImage}>
                                Subir al grupo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <p>Muestra de lo cargado:</p>
            {store.imageURL && <img src={store.imageURL} alt="Imagen subida" width={200} />}
        </div>
    );
};
