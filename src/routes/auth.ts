import { Router, Request, Response, NextFunction } from 'express';
import { body, check, validationResult, ValidationError, Result, ValidationChain } from 'express-validator';

import { auth } from '../controllers/authController';
import { Middleware } from '../globals/middleware';

class Routes extends Middleware {

    private router:Router;
    private validateFormLogin:ValidationChain[];
    private validateFormChangePassword:ValidationChain[];
    private validateFormChangePasswordByEmail:ValidationChain[];

    constructor() {

        super(process.env.SEED || "");

        this.router = Router();
        this.validateFormLogin = [
            body('email').isEmail().normalizeEmail().escape().withMessage('El email es incorrecto'),
            body('password').isLength({ min: 1 }).escape().withMessage('El password es requrido')
        ];
        this.validateFormChangePassword = [
            body('passwordCurrent').isLength({ min: 1 }).escape().withMessage('El password actual es requrido'),
            body('newPassword').escape(),
            body('repeatPassword').escape(),
        ];
        this.validateFormChangePasswordByEmail = [
            body('newPassword').escape(),
            body('repeatPassword').escape(),
        ];

        this.routes();
    }

    public getRouter():Router {

        return this.router;
    }

    private async showError(req:Request, res:Response, next:NextFunction):Promise<void> {

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

    private routes = ():void => {
        
        this.router.post('/login', this.validateFormLogin, this.showError, auth.authController );
        this.router.get('/info-permisos', this.verifyAuth, auth.getInfoPermits );
        
        this.router.put('/change-password',
            this.validateFormChangePassword,
            this.showError, this.verifyAuth,
            auth.changePassword
        );

        this.router.put('/change-password-by-email',
            this.validateFormChangePasswordByEmail,
            this.showError,
            auth.changePasswordByEmail
        );

        this.router.put('/send-email',
            body('email').isEmail().normalizeEmail().escape().withMessage('El email es incorrecto'),
            this.showError,
            auth.sendEmail
        );

        this.router.get('/verify-token-url', this.verifyAuth, auth.verifyTokenURL );
    }
}

export const routesAuth = new Routes();