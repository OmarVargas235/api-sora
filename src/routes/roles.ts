import { Router } from 'express';
import { body, ValidationChain } from 'express-validator';

import { rolesController } from '../controllers/rolesController';
import { Middleware } from '../globals/middleware';

class RouterRoles extends Middleware {

    private router:Router;
    private validateRoles:ValidationChain[];
    private validateUpdateRoles:ValidationChain[];

    constructor() {

        super(process.env.SEED || "");

        this.router = Router();
        this.validateRoles = [
            body('name').not().isEmpty().escape().withMessage('El campo Rol es requerido'),
        ];
        this.validateUpdateRoles = [
            body('name').not().isEmpty().escape().withMessage('El campo Rol es requerido'),
        ];

        this.routers();
    }

    public getRouter():Router {

        return this.router;
    }

    public routers = () => {

        this.router.get('/get-roles',
            this.verifyAuth,
            this.showError,
            rolesController.getRoles,
        );
        
        this.router.post('/create-rol',
            this.validateRoles,
            this.verifyAuth,
            this.showError,
            rolesController.createRol
        );

        this.router.put('/update-rol',
            this.validateUpdateRoles,
            this.verifyAuth,
            this.showError,
            rolesController.updateRol
        );
    }
}

export const routerRoles = new RouterRoles();