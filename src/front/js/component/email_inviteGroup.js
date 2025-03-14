import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Resend } from "resend";


export const EmailTemplate  = async ({ email, group_id}) => {
  const resend = Resend(process.env.RESEND_KEY)
  console.log(resend);
  const emailToSend= email
  const directionGroup= 'https://cautious-chainsaw-rj44xx4w449f5wxg-3000.app.github.dev/group/'+ group_id

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: emailToSend,
    subject: "Invitacion a LinkUp",
    html: "<h1>¡Hola!</h1> <p>Has recibido una invitación para unirte un grupo para gestionas los gastos de un evento.</p> <p><Haz click en el boton para aceder al grupo./p><a href=directionGroup><button>Ir a Ejemplo</button></a>"});

    console.log('data: ' ,data, 'error: ', error);

    const confirmSendEmail=data;
    console.log(confirmSendEmail);
    

  
};