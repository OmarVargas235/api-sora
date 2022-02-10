import { Request, Response } from 'express';

import { Area } from '../models/Areas';

class Areas {

    public getAreas = async (req:Request, res:Response):Promise<void> => {

        const { description, active, quantity, page } = req.query;

        if (!quantity || !page) {
            
            res.status(400).json({
                code: 400,
                error: true,
                data: "Debes enviar el campo 'Cantidad' y 'Pagina'"
            });

            return;
        }

        if (Number(quantity) < 1 || Number(page) < 1) {
            
            res.status(200).json({
                code: 200,
                error: false,
                data: [],
            });

            return;
        }

        let areasBD = await Area.find({
            $or: [{description}, {active}],
        }, { __v:0 }).limit( Number(quantity) ).skip( Number(page)-1 );

        areasBD = areasBD.length === 0
            ?  await Area.find({}, { __v:0 }).limit( Number(quantity) ).skip( Number(page)-1 )
            : areasBD;
        
        res.status(200).json({
            error: false,
            code: 200,
            data: areasBD,
        });
    }

    public createArea = async (req:Request, res:Response):Promise<void> => {

        const areaBD = new Area(req.body);

        await areaBD.save();

        res.status(200).json({
            code: 200,
            error: false,
            data: "Area creada con exito",
        });
    }

    public updateArea = async (req:Request, res:Response):Promise<void> => {

        const { id, ...update } = req.body;

        try {

            await Area.findByIdAndUpdate(id, update);

            res.status(200).json({
                code: 200,
                error: false,
                data: "Area actualizada con exito",
            });
        
        } catch(err:any) {

            err.kind === 'ObjectId' && res.status(200).json({
                error: true,
                code: 400,
                data: "Esta area no existe",
            });
        }
    }
}

export const areasController = new Areas();