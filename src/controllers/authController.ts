import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';
import { sendEmail } from '../config/mailer';
import { IOptions } from '../interfaces/IConfig';


interface IUserBD {
    name:string;
    email:string;
    id:string;
}

class Auth {

    private userBD: IUserBD|undefined;
    private seed: string;
    private time: string;

    constructor() {

        this.userBD = {
            name: '',
            email: '',
            id: '',
        }

        this.seed = process.env.SEED || "";
        this.time = process.env.SEED_TIME || "";
    }

    private setUserBD(data:IUserBD):void {

        const { name, email, id } = data;

        this.userBD = {
            name,
            email,
            id,
        };
    }

    private getUserBD = ():IUserBD|undefined => {

        return this.userBD;
    }

    public authController = async (req:Request, res: Response):Promise<void> => {

        const  { email, password } = req.body;
        
        try {

            const userBD = await User.findOne({ email });

            if (!userBD) {
                
                res.status(400).json({
                    error: true,
                    code: 400,
                    data: "Datos incorrectos",
                });

                return;
            }

            const isEqual:boolean = bcrypt.compareSync(password, userBD.password);

            this.setUserBD(userBD);

            const token = jwt.sign({
                email
            }, this.seed, { expiresIn: this.time });

            if (isEqual) {
                
                res.status(200).json({
                    error: false,
                    code: 200,
                    token,
                });
            
            } else {

                res.status(400).json({
                    error: true,
                    code: 400,
                    data: "Datos incorrectos",
                });
            }

        } catch(err) {

            res.status(400).json({
                error: true,
                code: 400,
            });
        }
    }

    public getInfoPermits = async (req:Request, res: Response):Promise<void> => {

        const token = req.headers.authorization || "";
        const userBD = await User.findOne({ token });

        try {

            jwt.verify(token, this.seed);

            this.setUserBD(userBD);
            
            res.status(200).json({
                code: 200,
                error: false,
                data: this.getUserBD(),
            });

        } catch(err) {

            this.setUserBD({name: '', email: '', id: ''});

            res.status(401).json({
                code: 401,
                error: true,
                data: "Sesion expirada",
            });
        }
    }

    public changePassword = async (req:Request, res: Response):Promise<void> => {

        const { passwordCurrent, newPassword } = req.body;
        const id:string|undefined = this.getUserBD()?.id;

        if (!id) return;

        const userBD = await User.findById(id);

        const isEqual:boolean = bcrypt.compareSync(passwordCurrent, userBD.password);

        if (!isEqual) {
            
            res.status(400).json({
                code: 400,
                error: true,
                data: "Comtraseña incorrecta",
            });

            return;
        }

        userBD.password = bcrypt.hashSync(newPassword, 12);

        await userBD.save();

        res.status(200).json({
            code: 200,
            error: false,
            data: "Contraseña cambiada con exito",
        });
    }

    public sendEmailChangePassword = async (req:Request, res: Response):Promise<void> => {

        const { email } = req.body;

        const userBD = await User.findOne({ email });

        if (!userBD) {

            res.status(400).json({
                error: true,
                code: 400,
                data: "No existe el usuario",
            });

            return;
        }

        const token = jwt.sign({
            url: "change-password"
        }, this.seed, { expiresIn: this.time });

        const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const options:IOptions = {
            email,
            subject: "cambiar contraseña (sora)",
            url,
        }

        sendEmail(options, res);
    }
}

export const auth = new Auth();