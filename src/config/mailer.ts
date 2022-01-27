import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Response } from "express";

import { IOptions } from '../interfaces/IConfig';

const templete = (url:string):string => ( `
	<h1 style="text-align:center; font-family: Arial, Helvetica;">Reestablecer Password</h1>
	<p style="font-family: Arial, Helvetica;">Hola, has solicitado reestablecer tu password, haz click en el siguiente enlace, este enlace es temporal, si se vence es necesario que vuelvas a solicitar otro e-mail.</p>
	<a style="display:block; 
		font-family: Arial, Helvetica;
		padding: 1rem; 
		background-color: #00C897; 
		color:white; 
		text-transform:uppercase; 
		text-align:center;
		text-decoration: none;" 
		href="${url}"
		target="_blank"
	>Resetear Password</a>
	<p style="font-family: Arial, Helvetica;">Si no puedes acceder a este enlace, visita: <a target="_blank" href="${url}">Aqui</a></p>
	<p style="font-family: Arial, Helvetica;">Si no solicitaste este e-mail, puedes ignorarlo</p>
`);


const transporter:Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'omarpruebas0@gmail.com',
		pass: process.env.MAILER,
    },
});

export const sendEmail = ({ email, subject, url }:IOptions, res:Response):void => {

    const message = {
        from: "sora@sora.com",
        to: email,
        subject,
        html: templete(url),
    };
    
    transporter.sendMail(message, function(err) {

        if (err) {
            
            res.status(400).json({
                code: 400,
                error: true,
                data: "A ocurrido un error, vuelva a intentar",
            });

            return console.log(err);
        }

        res.status(200).json({
            code: 200,
            error: false,
            data: "Revise la bandeja de entrada de su correo electronico",
        });
    });
}