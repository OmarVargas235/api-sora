import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';
import { sendEmail } from '../config/mailer';
import { IModule, IOptions } from '../interfaces/IConfig';

interface IUserBD {
    name:string;
    email:string;
    id:string;
    rol:string;
    idRol:number;
    modules: IModule[];
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
            rol: '',
            idRol: 0,
            modules: [],
        }

        this.seed = process.env.SEED || "";
        this.time = process.env.SEED_TIME || "";
    }

    private setUserBD(data:IUserBD):void {

        const { name, email, id, rol, idRol, modules } = data;
        
        this.userBD = {
            name,
            email,
            id,
            rol,
            idRol,
            modules,
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
        
        this.setUserBD(userBD);
        
        res.status(200).json({
            code: 200,
            error: false,
            data: this.getUserBD(),
        });
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

    public changePasswordByEmail = async (req:Request, res: Response):Promise<void> => {
        
        const { newPassword, tokenURL } = req.body;

        const userBD = await User.findOne({ tokenURL });

        if (!userBD) return;

        userBD.password = bcrypt.hashSync(newPassword, 12);
        userBD.tokenURL = "";

        await userBD.save();

        res.status(200).json({
            code: 200,
            error: false,
            data: "Contraseña cambiada con exito",
        });
    }

    public verifyTokenURL = async (req:Request, res: Response):Promise<Object|void> => {
        
        const tokenURL:string = req.headers.authorization || "empty";
        const userBD = await User.findOne({ tokenURL });

        if (!userBD) return res.status(401).json({
            code: 401,
            error: true,
            data: "token vencido"
        });;
    }

    public sendEmail = async (req:Request, res: Response):Promise<void> => {

        const { email } = req.body;

        const userBD = await User.findOne({ email });

        if (!userBD) {

            res.status(200).json({
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

        userBD.tokenURL = token;
        await userBD.save();

        const options:IOptions = {
            email,
            subject: "cambiar contraseña (sora)",
            url,
            token,
        }

        sendEmail(options, res);
    }
}

export const auth = new Auth();