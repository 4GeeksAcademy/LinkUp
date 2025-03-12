import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { BaseListGroups } from "../component/baseListGroups";
import "../../styles/private.css";
import "../../styles/index.css";
import barbacoa from "../../img/barbacoa.jpg";
import casa from "../../img/casa.jpg";
import cumpleInfantil from "../../img/cumpleInfantil.jpg";
import fiesta from "../../img/fiesta.jpg";
import viaje from "../../img/viaje.jpg";
import vacaciones from "../../img/vacaciones.jpg";
import { UploadFoto } from "../component/upLoadFoto";


export const Private = () => {
    //Añado al usuario desde localstore
    const nomusuario = localStorage.getItem("username");
    

    const imagenesPredeterminadas = [
        barbacoa,
        casa,
        cumpleInfantil,
        fiesta,
        viaje,
        vacaciones];

    const { store, actions } = useContext(Context);

    const [nombreGrupo, setNombreGrupo] = useState("");
    const [nuevoIntegrante, setNuevoIntegrante] = useState(""); // Estado para el input de integrante
    const [integrantes, setIntegrantes] = useState([nomusuario]); // Lista de integrantes
    const [imagenSeleccionada, setImagenSeleccionada] = useState();
    const [listGroups, setListGroups] = useState([])

    useEffect(() => {
        const fetchGroups = async () => {
            const data = await actions.getGroups();
            
            
            if (data && data.groups) { // Asegurar que los datos existen antes de actualizarlos
                setListGroups(data.groups);
                

            }
        };

        fetchGroups();
    }, []);

    
        

    const seleccionarImagen = (imagen) => {

        setImagenSeleccionada(imagen);

    };





    // Función para agregar un integrante a la lista
    const agregarIntegrante = () => {
        if (nuevoIntegrante.trim() !== "") {
            setIntegrantes([...integrantes, nuevoIntegrante]); // Agregar el integrante al array
            setNuevoIntegrante(""); // Limpiar el input
        }
    };

    // Función para eliminar un integrante de la lista
    const eliminarIntegrante = (index) => {
        setIntegrantes(integrantes.filter((_, i) => i !== index));
    };


    // Función para crear el grupo (enviar los datos)
    const crearGrupo = () => {
         
       
        const grupoCreado = {
            name: nombreGrupo,
            iconURL: imagenSeleccionada,
            membersList: integrantes.map(nombre => ({ name: nombre }))
        };

        createNewGroup(grupoCreado);
    };

    const handleDeleteGroup = (id) => {       
        actions.deleteGroup(id);        
        setListGroups((prevGrupos) => prevGrupos.filter((grupo) => grupo.id !== id));
    };



    const createNewGroup = (crearGrupo) => {
        const fetchNewGroup = async () => {
            const fetchedResponse = await actions.createGroup(crearGrupo);
            window.location.href = `/group/${fetchedResponse.id}`;
            
            


        };
        fetchNewGroup();
    };

    return (
        <div className="container-fluid d-flex justify-content-between">
            {/* primer cuerpo */}
            <div className="barlat bg-c3 d-block col-12 col-md-4 col-lg-3 ms-3 p-0 align-items-center ">
                {/* encabezado */}
                <div className=" d-block rounded  container-fluid bartitle bg-c3 ms-1 p-0">
                    <div className="bg-c5 rounded text-center mt-2 ms-2 mb-2 d-flex justify-content-between align-items-center">
                        <h3 className="text-c1 pb-1 mt-1 flex-grow-1">Tus grupos</h3>

                        {/* Dropdown */}
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle mt-1 text-c1 bg-c5 me-3"
                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa-solid fa-users-rectangle"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end bg-c5 text-c1 drp">
                                <li>
                                    <button type="button" className="btn dropdown-item"
                                        data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                        Crear un grupo
                                    </button>
                                </li>
                                <li><a className="dropdown-item" href="#">Unirme a un grupo</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Lista de grupos */}
                <div className="mx-2 congroups d-flex flex-column gap-2">
                {listGroups.map((datos) => (
                        <BaseListGroups
                            key={datos.id}
                            datos={datos}
                            onDelete={handleDeleteGroup} 
                        />
                    ))}
                </div>
            </div>

            {/* Contenido Principal (donde iría otra sección, si la hay) */}
            <div className="col-12 col-md-8 col-lg-9 p-3">
                {/* Aquí podrías poner el contenido principal */}
            </div>

            {/* <!-- Modal --> */}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Crear Grupo</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Input para el nombre del grupo */}
                            <p>Nombre del grupo</p>
                            
                            <input
                                type="text"
                                className="form-control"
                                value={nombreGrupo}
                                onChange={(e) => setNombreGrupo(e.target.value)}
                                required />
                            <p className="mt-3">Seleccionar imagen de grupo</p>
                            <div className="d-flex flex-wrap gap-2">
                                {imagenesPredeterminadas.map((img, index) => (
                                    <img key={index} src={img} alt="Grupo"
                                        className={`img-thumbnail ${imagenSeleccionada === img ? "border border-primary" : ""}`}
                                        style={{ width: "70px", height: "70px", cursor: "pointer" }}
                                        onClick={() => seleccionarImagen(img)}
                                    />
                                ))}
                            </div>
                            {/* Input para agregar integrantes */}
                            <p className="mt-3">Agregar Integrantes</p>
                            <div className="d-flex">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Nombre del integrante"
                                    value={nuevoIntegrante}
                                    onChange={(e) => setNuevoIntegrante(e.target.value)}
                                />
                                <button className="btn btn-success" onClick={agregarIntegrante}><i className="fa-solid fa-square-check"></i></button>
                            </div>

                            {/* Lista de integrantes agregados */}
                            <ul className="list-group mt-3">
                                {integrantes.map((integrante, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        {integrante}
                                        <button className="btn btn-danger btn-sm" onClick={() => eliminarIntegrante(index)}><i className="fa-solid fa-trash"></i></button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={crearGrupo} data-bs-dismiss="modal" >Crear Grupo</button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Segundo cuerpo */}
            <div className="divCuerpo bg-c3 container-floid d-block">
                <div className="containesr-fluid contitle bg-c3">
                    <div className="mt-3 ms-3 text-c5 bg-c2 d-flex justify-content-center titleName rounded">
                        <h3 className="text-center">Novedades de los grupos</h3>
                    </div></div>
                <div className="d-block justify-content-around text-white mt-5">
                    <p> ¡Bienvenidos a LinkUP!</p>
                    <p>.¡Bienvenidos a LinkUP!</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.yttyj</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.fdsfdf</p>
                    <p>.dfsdfsdfdsfdsfasfaddv</p>
                    <p>.</p>
                    <p>.fdsfsdf</p>
                    <p>.dsfas</p>
                    <p>.ewrqwerewrregas gb </p>
                    <p>.gqergcvdf xvfdgga</p>
                    <p>.rqce fvdfgegerg</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                </div>
            </div>
        </div >
    );
};