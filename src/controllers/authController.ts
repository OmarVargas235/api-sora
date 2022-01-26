import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';

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

            const userBD = await User.findOne({ email: email });
            const isPassword = bcrypt.compareSync(password, userBD.password);

            this.setUserBD(userBD);

            const token = jwt.sign({
                email
            }, this.seed, { expiresIn: this.time });

            if (isPassword) {
                
                res.status(200).json({
                    error: false,
                    code: 200,
                    token,
                });
            }

        } catch(err) {

            console.log(err);

            res.status(400).json({
                error: true,
                code: 400,
            });
        }
    }

    public getInfoPermits = (req:Request, res: Response):void => {

        const token = req.headers.authorization || "";

        try {

            jwt.verify(token, this.seed);
            
            res.status(200).json({
                code: 200,
                error: false,
                data: this.getUserBD(),
            });

        } catch(err) {

            res.status(401).json({
                code: 401,
                error: true,
                data: "Sesion expirada",
            });

        }
    }

    public changePassword = async (req:Request, res: Response):Promise<void> => {

        console.log(req.body);
    }

    public changePasswordByEmail = async (req:Request, res: Response):Promise<void> => {

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
    }
}

export const auth = new Auth();