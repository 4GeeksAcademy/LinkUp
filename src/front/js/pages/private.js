import React, { useState, useEffect } from "react";
import api from './../api';
import {UploadFoto} from "../component/upLoadFoto"

export const Private = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false); // para no rellamar   a la funcion mientras esta cargando :-)
    const [error, setError] = useState(null);

    const getUserData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token'); // Obtiene el token del Storage
            if (!token) {
                setError("No hay token disponible. Inicia sesión.");
                setLoading(false);
                return;
            }
            const response = await api.post(
                `/user`,
                {}, 
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            ); // Llamada a la API (api.post equivale al fetch con metodo POST)
            setUserData(response.data); 
        } catch (error) {
            setError(error.response?.data?.message || "Error obteniendo usuario");
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     getUserData();  // Llama a la API automáticamente al cargar la págin, por si lo veis necesario
    // }, []);

    return (
        <div className="mt-5 mb-5 h-50">
            <br />
            <div className="mt-5">
                <button onClick={getUserData} disabled={loading}>
                    {loading ? "Cargando..." : "Obtener Datos del Usuario"}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {userData && (
                    <div>
                        <h3>Usuario: {userData.username}</h3>
                        <p>Email: {userData.email}</p>
                        {userData.picture && <img src={userData.picture} alt="Avatar" width={100} />}
                    </div>
                )}
            </div>
                <UploadFoto/>
        </div>
    );
};