import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { check, validationResult, ValidationError, Result } from 'express-validator';

export abstract class Middleware {

    private seed:string;

    constructor(seed:string) {

        this.seed = seed;
    }

    protected verifyAuth = async (req:Request, res:Response, next:NextFunction):Promise<void> => {

        const token:string = req.headers.authorization || "";

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

    protected async showError(req:Request, res:Response, next:NextFunction):Promise<void> {

        const { repeatPassword } = req.body;

        repeatPassword && await check('newPassword').equals(repeatPassword).withMessage('Los passwords deben de ser iguales').run(req);

        const errors:Result<ValidationError> = validationResult(req);
        const isErrors:boolean = errors.isEmpty();
        const msgErros:ValidationError[] = errors.array();

        if (!isErrors) {

            const filterMessagesErrros:string[] = msgErros.map(msg => msg.msg);

            res.status(200).json({
                code: 400,
                error: true,
                data: filterMessagesErrros,
            });
            
            return;
        }
        
        next();
    }
}