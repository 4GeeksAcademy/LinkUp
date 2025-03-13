import api from './../api';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from 'sweetalert2'

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

            Swal.fire({
                title: "¡Se realizo inicio de sesión con exito!",
                icon: "success",
                draggable: true
              });
            navigate("/private"); // Redirige a la zona privada
            return true;
        } 
    } catch (error) {
        if (error.response?.status === 401)
            {Swal.fire({
            title: "Usuario o contraseña incorrectos. ¡Inténtalo de nuevo!",
            icon: "error",
            draggable: true
          });
           
        } else {
            {Swal.fire({
                title: "Error en el inicio de sesión. Inténtalo más tarde.",
                icon: "error",
                draggable: true
              });

            
        }
        console.error("Error en el login:", error.response?.data || error);
        return false;
    }
};
}


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
            Swal.fire({
                title: "Te has registrado correctamente",
                icon: "success",
                draggable: true
              });
            navigate("/private");
            return true;
        }
        
    } catch (error) {
        if (error.response && error.response.status === 400) {
            Swal.fire({
                title: "Error en el registro, intentalo mas tarde o cambia lo datos.",
                icon: "error",
                draggable: true
              });
            
        } else {
            Swal.fire({
                title: "El usuario o el email ya estan registrados. Intenta con otro.",
                icon: "error",
                draggable: true
              });
            
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

            Swal.fire({
                title: "Te has registrado correctamente",
                icon: "success",
                draggable: true
              });
            navigate("/private");
            return true;
        }  else if (response.status === 404) { // Añadimos manejo para el error 404
            Swal.fire({
                title: response.data?.error || "Usuario no registrado.",
                icon: "error",
                draggable: true
              });
            
        }  else {
            console.error("Error en la respuesta del backend:", response.data);
                Swal.fire({
                title: response.data?.error || "Error en el inicio de sesión con Google",
                icon: "error",
                draggable: true
              });
            
        }
    } catch (error) {
        console.error("Error en la autenticación con Google:", error.response?.data || error);
        Swal.fire({
            title: response.data?.error || "Error al registrarse con Google",
            icon: "error",
            draggable: true
          });
        
    }
};

