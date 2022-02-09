import { Router } from 'express';

import { routesGlobalsController } from '../globals/routesController';
import { Middleware } from '../globals/middleware';

class RouterGlobals extends Middleware {

    private router:Router;

    constructor() {

        super(process.env.SEED || '');

        this.router = Router();

        this.routes();
    }

    public getRouter():Router {

        return this.router;
    }

    private routes():void {

        this.router.get('/areas', this.verifyAuth, routesGlobalsController.getAreas);
        this.router.get('/roles', this.verifyAuth, routesGlobalsController.getRoles);
    }
}

export const routerGlobals = new RouterGlobals();