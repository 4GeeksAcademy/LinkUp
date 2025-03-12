import api from './../api';
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const LoginNormal = async (username, password, navigate) => {
    try {
        const response = await api.post(`/login`, { username, password });

        if (response.status === 200) {
            console.log("Usuario autenticado:", response.data);

            // Guardar token y username en localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('picture', response.data.avatar);

            alert("Inicio de sesión exitoso!");
            navigate("/private"); // Redirige a la zona privada
            return true;
        } 
    } catch (error) {
        if (error.response?.status === 401) {
            alert("Usuario o contraseña incorrectos. ¡Inténtalo de nuevo!");
        } else {
            alert("Error en el inicio de sesión. Inténtalo más tarde.");
        }
        console.error("Error en el login:", error.response?.data || error);
        return false;
    }
};

export const SignNormal = async (username, email, password, navigate) => {
    
    try {
        const response = await api.post(`/signup`, {
            username,
            email,
            password,
            is_active: true,
        });

        if (response.status === 201) {
            
            // Guardar token y datos del usuario en localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('picture', response.data.picture);
            alert('¡¡Registro exitoso, puedes acceder!!');
            navigate("/private");
            return true;
        }
        
    } catch (error) {
        if (error.response && error.response.status === 400) {
            alert('Error en el registro, intentalo mas tarde o cambia lo datos.');
        } else {
            alert('El usuario o el email ya estan registrados. Intenta con otro.');
        }
        console.error('Error en el registro:', error.response?.data || error);
        return false;
    }
};

export const SignGoogle = async (credentialResponse, navigate) => {
    const { credential } = credentialResponse; // Este es el token de Google
console.log({tokenId: credential});

    try {
        const response = await api.post(`/signup_google`, { tokenId: credential }, {headers:{"Content-Type": "application/json"}});

        if (response.status === 201) {
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

