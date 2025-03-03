import api from './../api';
import { jwtDecode } from "jwt-decode";
import axios from "axios";


    

export const SignNormal = async (username, email, password) => {
    
    try {
        const response = await api.post(`/signup`, {
            username,
            email,
            password,
            is_active: true,
        });

        if (response.status === 201) {
            alert('Signed up successfully!');
            window.location.reload();
            return true;
        }
    } catch (error) {
        console.error('Error en el registro:', error.response?.data || error);
        alert('Something went wrong! Try again');
        return false;
    }
};

export const SignGoogle = async (credentialResponse, navigate) => {
    const { credential } = credentialResponse; // Este es el token de Google
console.log({tokenId: credential});

    try {
        const response = await api.post(`/signup_google`, { tokenId: credential }, { withCredentials: true });

        if (response.status === 200) {
            console.log("Respuesta del backend:", response.data);

            // Guardar token y datos del usuario en localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('picture', response.data.picture);

            alert("Registro con Google exitoso!");
            navigate("/private");
            return true;
        }  else if (response.status === 404) { // Añadimos manejo para el error 404
            alert(response.data?.error || "Usuario no registrado.");
        }  else {
            console.error("Error en la respuesta del backend:", response.data);
            alert(response.data?.message || "Error en el inicio de sesión con Google");
        }
    } catch (error) {
        console.error("Error en la autenticación con Google:", error.response?.data || error);
        alert(error.response?.data?.message || "Error al registrarse con Google");
    }
};

