import { Request, Response } from 'express';

import { Area } from '../models/Areas';
import { Rol } from '../models/Rol';

class RoutesGlobalsController {

    public async getAreas(req:Request, res:Response):Promise<void> {

        const areasBD = await Area.find({}, { __v:0 });

        res.status(200).json({
            code: 200,
            error: false,
            data: areasBD,
        });
    }

    public async getRoles(req:Request, res:Response):Promise<void> {

        const rolesBD = await Rol.find({}, { __v:0 });

        res.status(200).json({
            code: 200,
            error: false,
            data: rolesBD,
        });
    }
}

export const routesGlobalsController = new RoutesGlobalsController();