import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css";
import "../../styles/index.css";
import user from "../../img/user.webp"
import { Link } from "react-router-dom";

export const Profile = () => {
    const { store, actions } = useContext(Context);

    return (
    <div className="body-profile">
      <div className="container mt-5" id="profile-container">
        <div className="row">
          <div className="col-md-4 d-flex justify-content-center align-items-center">
            <img
            src={user}
            alt="Foto de perfil"
            className="img-fluid rounded-circle border"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
        </div>

        <div className="col-md-8">
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Información acerca del perfil</h5>
            <form>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" placeholder="Tu usuario" />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="correo@example.com" />
              </div>
              <div className="mb-3">
                <label className="form-label">Apodo</label>
                <input type="text" className="form-control" placeholder="" />
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
        </div>
    );
};
