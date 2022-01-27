import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export class Middleware {

    private seed:string;

    constructor(seed:string) {

        this.seed = seed;
    }

    public verifyAuth = async (req:Request, res:Response, next:NextFunction):Promise<void> => {

        const token = req.headers.authorization || "";

        try {

            jwt.verify(token, this.seed);

            next();

        } catch(err) {

            res.status(401).json({
                code: 401,
                error: true,
                data: "No autorizado",
            });
        }
    }
}