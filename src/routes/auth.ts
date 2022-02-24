import { Router, Request, Response, NextFunction } from 'express';
import { body, ValidationChain } from 'express-validator';

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
            body('email').not().isEmpty().escape().withMessage('El email o usuario es incorrecto'),
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