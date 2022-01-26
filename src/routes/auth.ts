import { Router } from 'express';

import { auth } from '../controllers/authController';

class Routes {

    private router:Router;

    constructor() {

        this.router = Router();

        this.routes();
    }

    public getRouter():Router {

        return this.router;
    }

    private routes():void {
        
        this.router.post('/login', auth.authController );
        this.router.get('/info-permisos', auth.getInfoPermits );
        this.router.put('/change-password', auth.changePassword );
        this.router.put('/change-password-by-email', auth.changePasswordByEmail );
    }
}

export const routesAuth = new Routes();