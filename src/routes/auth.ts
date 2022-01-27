import { Router } from 'express';

import { auth } from '../controllers/authController';
import { Middleware } from '../globals/middleware';

class Routes extends Middleware {

    private router:Router;

    constructor() {

        super(process.env.SEED || "");

        this.router = Router();

        this.routes();
    }

    public getRouter():Router {

        return this.router;
    }

    private routes = ():void => {
        
        this.router.post('/login', auth.authController );
        this.router.get('/info-permisos', auth.getInfoPermits );
        this.router.put('/change-password', this.verifyAuth, auth.changePassword );
        this.router.put('/change-password-by-email', this.verifyAuth, auth.sendEmailChangePassword );
    }
}

export const routesAuth = new Routes();