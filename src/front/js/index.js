//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";


//render your react application
ReactDOM.render(
    <GoogleOAuthProvider clientId="18163537172-9lapegg0ukbca7p9man17m3due5dh29n.apps.googleusercontent.com">
       <Layout /> 
       </GoogleOAuthProvider>, 
       document.querySelector("#app"));
