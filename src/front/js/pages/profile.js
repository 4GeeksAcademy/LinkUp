import React, { useContext, useState, useEffect} from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css";
import "../../styles/index.css";
import userDefault from "../../img/user.webp";
import { Link } from "react-router-dom";


export const Profile = () => {
  
  const { store, actions } = useContext(Context);
  const [image, setImage] = useState(userDefault);
  const [emailDef, setEmailDef] = useState();
  const [nameDef, setNameDef] = useState()
  

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };
  useEffect(()=>{
    setImage( localStorage.getItem("picture")),
    setEmailDef(localStorage.getItem("email")),
    setNameDef(localStorage.getItem("username"))
  },[])



  return (
    <div className="body-profile">
      <div className="container mt-5" id="profile-container">
        <div className="row ">
          <div className="col-md-4 d-flex justify-content-end foto position-relative ">
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <img
<<<<<<< HEAD
              src={image}
              alt="Foto de perfil"
              className="img-fluid rounded-circle border"
              style={{ width: "150px", height: "150px", objectFit: "cover", marginRight: "20px" }}
=======
            src={image}
            alt="Foto de perfil"
            className="img-fluid rounded-circle border "
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
>>>>>>> main
            />
        </div>

<<<<<<< HEAD
          <div className="col-md-8 form">
            <h5>Información acerca del perfil</h5>
            <div className="input-user">
              <input type="text" required autocomplete="off" /><label for="text">Username</label>
              <div className="underline"></div>
            </div>
            <div className="input-user">
              <input type="email" required autocomplete="off" /><label for="text">Email</label>
              <div className="underline"></div>
            </div>
            <div className="input-user">
              <input type="text" required autocomplete="off" /><label for="text">Apodo</label>
              <div className="underline"></div>
            </div>

            <div className="value">
              <input type="submit" className="save" value="Guardar Cambios" />
=======
          <div className="col-md-8">
            <div className="card p-4 shadow-lg" id="perfil-container">
              <h5 className="mb-3">Información acerca del perfil</h5>
              <form>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control" placeholder={nameDef} disabled/>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder={emailDef} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apodo</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="d-flex justify-content-end">
                  <button type="submit" className="save"><a className="text-c1" href="/private">Guardar cambios</a></button>
                </div>
              </form>
>>>>>>> main
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
