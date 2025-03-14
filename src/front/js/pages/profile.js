import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css";
import "../../styles/index.css";
import userDefault from "../../img/user.webp";
import { Link } from "react-router-dom";

export const Profile = () => {
  const { store, actions } = useContext(Context);
  const [image, setImage] = useState(userDefault);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="body-profile">
      <div className="container mt-5" id="profile-container">
        <div className="row">
          <div className="col-md-4 d-flex justify-content-end foto position-relative">
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <img
              src={image}
              alt="Foto de perfil"
              className="img-fluid rounded-circle border"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
            <i
              className="fa-solid fa-pen-to-square position-absolute bg-white p-2 rounded-circle shadow"
              style={{
                top: "10px",
                right: "10px",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: "#333"
              }}
              onClick={() => document.getElementById("fileInput").click()}
            ></i>
          </div>

          <div className="col-md-8">
            <div className="card p-4 shadow-sm" id="perfil-container">
              <h5 className="mb-3">Información acerca del perfil</h5>
              <form>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apodo</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="d-flex justify-content-end">
                  <button type="submit" className="save">Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
