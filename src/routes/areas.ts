import { Router } from 'express';
import { body, ValidationChain } from 'express-validator';

import { areasController } from '../controllers/areasController';
import { Middleware } from '../globals/middleware';

class RouterAreas extends Middleware {

    private router:Router;
    private validateAreas:ValidationChain[];
    private validateIDAreas:ValidationChain[];

    constructor() {

        super(process.env.SEED || "");

        this.router = Router();
        this.validateAreas = [
            body('description').not().isEmpty().escape().withMessage('El campo descripción es requerido'),
        ];
        this.validateIDAreas = [
            body('id').not().isEmpty().escape().withMessage('El ID es requerido'),
        ];

        this.routers();
    }

    public getRouter():Router {

        return this.router;
    }

    public routers = () => {

        this.router.get('/get-areas',
            this.verifyAuth,
            this.showError,
            areasController.getAreas,
        );
        this.router.post('/create-area',
            this.validateAreas,
            this.verifyAuth,
            this.showError,
            areasController.createArea
        );
        this.router.put('/update-area',
            this.validateAreas,
            this.validateIDAreas,
            this.verifyAuth,
            this.showError,
            areasController.updateArea
        );
    }
}

export const routerAreas = new RouterAreas();