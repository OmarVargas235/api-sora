import { Router } from 'express';
import { body, ValidationChain } from 'express-validator';

import { user } from '../controllers/userController';
import { Middleware } from '../globals/middleware';

class UserRoutes extends Middleware {

    private router:Router;
    private validateUser:ValidationChain[];
    private validateCreateUser:ValidationChain[];
    private validateUpdateUser:ValidationChain[];
    // private validateFormChangePassword:ValidationChain[];
    // private validateFormChangePasswordByEmail:ValidationChain[];

    constructor() {

        super(process.env.SEED || "");

        this.router = Router();
        this.validateUser = [
            body('name').not().isEmpty().escape().withMessage('El campo nombre es requerido'),
            body('email').not().isEmpty().escape().withMessage('El campo email es requerido'),
            body('idRol').not().isEmpty().escape().withMessage('El campo rol es requerido'),
            body('idArea').not().isEmpty().escape().withMessage('El campo area es requerido'),
        ];
        this.validateCreateUser = [
            body('password').not().isEmpty().escape().withMessage('El campo password es requerido'),
        ];
        this.validateUpdateUser = [
            body('id').not().isEmpty().escape().withMessage('El ID es requerido'),
        ];

        this.routes();
    }

    public getRouter():Router {

        return this.router;
    }

    private routes = ():void => {

        this.router.post('/create-user',
            this.validateUser,
            this.validateCreateUser,
            this.verifyAuth,
            this.showError,
            user.createUser,
        );

        this.router.put('/update-user',
            this.validateUser,
            this.validateUpdateUser,
            this.verifyAuth,
            this.showError,
            user.updateUser,
        );
    }
}

export const routerUser = new UserRoutes();