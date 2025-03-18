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
import Swal from 'sweetalert2';


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
    const [integrantes, setIntegrantes] = useState([]); // Lista de integrantes
    const [imagenSeleccionada, setImagenSeleccionada] = useState();
    const [listGroups, setListGroups] = useState([]);
    const [errorMensaje, setErrorMensaje] = useState("");

    useEffect(() => {
        fetchGroups();

        const integrante = {
            name: nomusuario,
            you: true,
        }
        setIntegrantes([integrante]);

    }, [nomusuario]);

    const fetchGroups = async () => {
        const data = await actions.getGroups();


        if (data && data.groups) { // Asegurar que los datos existen antes de actualizarlos
            setListGroups(data.groups);


        }
    };


    const seleccionarImagen = (imagen) => {

        setImagenSeleccionada(imagen);

    };





    // Función para agregar un integrante a la lista
    const agregarIntegrante = () => {
        const newIntgrante = {
            name: nuevoIntegrante,
            you: false,
        }


        if (nuevoIntegrante.trim() !== "") {
            setIntegrantes([...integrantes, newIntgrante]); // Agregar el integrante al array
            setNuevoIntegrante(""); // Limpiar el input
        }
    };

    // Función para eliminar un integrante de la lista
    const eliminarIntegrante = (index) => {
        setIntegrantes(integrantes.filter((_, i) => i !== index));
    };

    const asignarTuIntegrante = (member) => {
        // Crear una copia del array para evitar mutaciones
        let newIntegrantes = integrantes.map(integrante => ({
            ...integrante,
            you: integrante.name === member.name // Asigna "you" a true solo al seleccionado
        }));

        setIntegrantes(newIntegrantes);
    };



    // Función para crear el grupo (enviar los datos)
    const crearGrupo = () => {
        if (!nombreGrupo) {
            setErrorMensaje("Debes ingresar un nombre para el grupo.");
            return;
        }
        if (!imagenSeleccionada) {
            setErrorMensaje("Debes seleccionar una imagen para el grupo.");
            return;
        }
        if (integrantes.length < 2) {
            setErrorMensaje("Debes añadir al menos dos integrantes al grupo.");
            return;
        }
        let haveYou = false;

        integrantes.forEach(member => {
            if (member.you) {
                haveYou = true;
            }
        });

        if (!haveYou) {
            setErrorMensaje("Debes indicar quien eres tu dentro del grupo.");
            return;
        }


        const grupoCreado = {
            name: nombreGrupo,
            iconURL: imagenSeleccionada,
            membersList: integrantes.map(nombre => ({ name: nombre.name }))

        };
        // Modal info
        const Toast = Swal.mixin({
            toast: true,
            position: "center",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
                setErrorMensaje("");
            }

        });
        Toast.fire({
            icon: "success",
            title: "¡Grupo creado correctamente!"
        });

        createNewGroup(grupoCreado);

    };

    const handleDeleteGroup = (e) => {

        e.membersList.forEach(member => {
            if (member.user_email === localStorage.getItem('email')) {

                const fetchRemove = async () => {
                    const data = await actions.removeUserEmail(member.id);
                    fetchGroups();
                };

                fetchRemove();
            }

        });
    };

    const handleOpenModalCreateGroup = () => {


    };

    const createNewGroup = (crearGrupo) => {
        const modal = document.getElementById("CrearGrupoModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide()

        const fetchNewGroup = async () => {

            let youName = "";
            integrantes.forEach(member => {
                if (member.you) {
                    youName = member.name;
                }
            });
            const fetchedResponse = await actions.createGroup(crearGrupo, youName);
            window.location.href = `/group/${fetchedResponse.id}`;



        };
        fetchNewGroup();
    };

    return (
        <div className="container-fluid d-flex justify-content-center body-private">
            <div className="barlat bg-c3 d-block col-12 col-md-4 col-lg-3 ms-3 p-0 align-items-center ">
                <div className=" d-block rounded  container-fluid bartitle bg-c3 ms-1 p-0">
                    <div className="bg-c5 rounded text-center mt-2 ms-2 mb-2 d-flex justify-content-between align-items-center">
                        <h3 className="text-c1 pb-1 mt-1 flex-grow-1">Tus grupos</h3>

                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle mt-1 text-c1 bg-c5 me-3"
                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa-solid fa-users-rectangle"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end bg-c5 text-c1 drp">
                                <li>
                                    <button type="button" className="btn dropdown-item"
                                        data-bs-toggle="modal" data-bs-target="#CrearGrupoModal" onClick={handleOpenModalCreateGroup}>
                                        Crear un grupo
                                    </button>
                                </li>
                                
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mx-2 congroups d-flex flex-column gap-2">
                    {listGroups.map((datos) => (
                        <BaseListGroups
                            key={datos.id}
                            datos={datos}
                            onDelete={() => handleDeleteGroup(datos)}
                        />
                    ))}
                </div>
            </div>

            <div className="col-12 col-md-8 col-lg-9 p-3">
            </div>

            <div className="modal fade" id="CrearGrupoModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel">
                <div className="modal-dialog">
                    <div className="modal-content bg-c4">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-c5" id="staticBackdropLabel">Crear Grupo</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-white">
                            <p>Nombre del grupo</p>

                            <input
                                type="text"
                                className="form-control"
                                value={nombreGrupo}
                                onChange={(e) => setNombreGrupo(e.target.value)}
                                onClick={() => setErrorMensaje("")} />
                            <p className="mt-3">Seleccionar imagen de grupo</p>
                            <div className="d-flex flex-wrap gap-2">
                                {imagenesPredeterminadas.map((img, index) => (
                                    <img key={index} src={img} alt="Grupo"
                                        className={`img-thumbnail ${imagenSeleccionada === img ? "border border-danger" : ""}`}
                                        style={{ width: "70px", height: "70px", cursor: "pointer" }}
                                        onClick={() => seleccionarImagen(img)}
                                    />
                                ))}
                            </div>
                            <p className="mt-3">Agregar Integrantes</p>
                            <div className="d-flex">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Nombre del integrante"
                                    value={nuevoIntegrante}
                                    onChange={(e) => setNuevoIntegrante(e.target.value)}
                                    onClick={() => setErrorMensaje("")}
                                    onKeyDown={(e) => e.key === "Enter" && agregarIntegrante()}
                                />
                                <button className="btn btn-success" onClick={agregarIntegrante}><i className="fa-solid fa-square-check"></i></button>
                            </div>

                            <ul className="list-group mt-3">
                                {integrantes.map((integrante, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        {!integrante.you ? integrante.name : integrante.name + " (yo)"}
                                        <div>
                                            {!integrante.you ? <button className="btn btn-primary btn-sm me-1" onClick={() => asignarTuIntegrante(integrante)}><i class="fa-solid fa-user"></i></button> : ""}
                                            <button className="btn btn-danger btn-sm ms-1" onClick={() => eliminarIntegrante(index)}><i className="fa-solid fa-trash"></i></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-dark" data-bs-dismiss="modal">Cancelar</button>

                            <button type="button"
                                className="btn btn-outline-light"
                                onClick={crearGrupo}

                            >Crear Grupo</button>
                            {errorMensaje && <p className="text-c5 fw-bold mt-2">{errorMensaje}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="divCuerpo bg-c3 container-floid d-block">
                <div className="containesr-fluid contitle bg-c3">
                    <div className="mt-3 ms-3 text-c5 bg-c2 d-flex justify-content-center titleName rounded">
                        <h3 className="text-center">Novedades de los grupos</h3>
                    </div></div>
                <div className="d-block justify-content-center text-white mt-5">
                    <br />
                    <div className="d-flex justify-content-center">
                    <p>¡Bienvenidos a LinkUP!</p>   
                    </div>
                    <div className="border-bottom border-2 d-flex align-items-center justify-content-between pt-2 pb-3 px-3 mb-1">
                    <p>Rembolso de Erwin a Arnau de 1749.42€
                    Rembolsado el 17-03-2025</p>   
                    </div>
                    <div className="border-bottom border-2 d-flex align-items-center justify-content-between pt-2 pb-3 px-3 mb-1">
                    <p>Rembolso de Nacho a Arnau de 1749.42€
                    Rembolsado el 14-03-2025</p>   
                    </div>
                    <div className="border-bottom border-2 d-flex align-items-center justify-content-between pt-2 pb-3 px-3 mb-1">
                    <p>Rembolso de Lucrecia a Arnau de 1749.42€
                    Rembolsado el 14-03-2025</p>   
                    </div>
                    <div className="border-bottom border-2 d-flex align-items-center justify-content-between pt-2 pb-3 px-3 mb-1">
                    <p>Rembolso de Domi Ramimora (yo) a Arnau de 1749.39€
                    Rembolsado el 14-03-2025</p>   
                    </div>
                    <div className="border-bottom border-2 d-flex align-items-center justify-content-between pt-2 pb-3 px-3 mb-1">
                    <p>Rembolso de David a Arnau de 1749.42€
                    Rembolsado el 17-03-2025</p>   
                    </div>
                    <div className="border-bottom border-2 d-flex align-items-center justify-content-between pt-2 pb-3 px-3 mb-1">
                    <p>Rembolso de Domi Ramimora (yo) a Mar de 108.46€
                    Rembolsado el 14-03-2025</p>   
                    </div>
                    <div className="border-bottom border-2 d-flex align-items-center justify-content-between pt-2 pb-3 px-3 mb-1">
                    <p>Rembolso de Domi Ramimora (yo) a Nacho de 22.57€
                    Rembolsado el 14-03-2025</p>   
                    </div>
                    <div className="border-bottom border-2 d-flex align-items-center justify-content-between pt-2 pb-3 px-3 mb-1">
                    <p>Rembolso de Domi Ramimora (yo) a Arnau de 11.66€
                    Rembolsado el 14-03-2025</p>   
                    </div>
                    <div className="border-bottom border-2 d-flex align-items-center justify-content-between pt-2 pb-3 px-3 mb-1">
                    <p>Rembolso de Leo a Mar de 18.4€
                    Rembolsado el 16-03-2025</p>   
                    </div>
                    <div className="border-bottom border-2 d-flex align-items-center justify-content-between pt-2 pb-3 px-3 mb-1">
                    <p>Rembolso de Leo a Domi Ramimora (yo) de 20.87€
                    Rembolsado el 17-03-2025</p>   
                    </div>
                

                    
              
                </div>
            </div> */}
        </div >
    );
};