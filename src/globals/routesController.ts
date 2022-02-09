import { Request, Response } from 'express';

import { areas } from '../utils/areas';
import { roles } from '../utils/roles';

class RoutesGlobalsController {

    public getAreas(req:Request, res:Response):void {

        res.status(200).json({
            code: 200,
            error: false,
            data: areas,
        });
    }

    public getRoles(req:Request, res:Response):void {

        res.status(200).json({
            code: 200,
            error: false,
            data: roles,
        });
    }
}

export const routesGlobalsController = new RoutesGlobalsController();