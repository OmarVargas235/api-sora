import { Request, Response } from 'express';
import ExcelJS from 'exceljs';

import { Area } from '../models/Areas';
import { generateExcel } from '../utils/helper';

interface IArea {
    description:string;
    active:boolean;
}

class Areas {

    public getAreas = async (req:Request, res:Response):Promise<void> => {

        const { limit, description } = req.query;

        if (!limit) {
            
            res.status(400).json({
                code: 400,
                error: true,
                data: "Debes enviar el campo 'limit'"
            });

            return;
        }

        if (Number(limit) < 0) {
            
            res.status(200).json({
                code: 200,
                error: false,
                data: [],
            });

            return;
        }

        const text:string = description as string;
        const regex = new RegExp(text, "g");
        
        const areasBD = await Area.find({
            description: regex,
            $and: [{ active: true }],
        }, { __v:0 }).limit(Number(limit));
        
        res.status(200).json({
            error: false,
            code: 200,
            data: areasBD,
        });
    }

    public createArea = async (req:Request, res:Response):Promise<void> => {

        try {

            const areaBD = new Area(req.body);

            await areaBD.save();

            res.status(200).json({
                code: 200,
                error: false,
                data: "Area creada con exito",
            });
        
        } catch(err:any) {

            console.log({ step: 'areasController createArea', error: err.toString() });

            if ( err && err.code === 11000 ) res.status(200).json({
                error: true,
                code: 400,
                data: "Esta area ya existe",
            });
        }
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

            console.log({ step: 'areasController updateArea', error: err.toString() });

            err.kind === 'ObjectId' && res.status(200).json({
                error: true,
                code: 400,
                data: "Esta area no existe",
            });
        }
    }

    public deleteArea = async (req:Request, res:Response):Promise<void> => {

        const { id } = req.body;

        try {

            await Area.findByIdAndUpdate(id, { active: false });

            res.status(200).json({
                code: 200,
                error: false,
                data: "Area inactivada con exito",
            });
        
        } catch(err:any) {

            console.log({ step: 'areasController deleteArea', error: err.toString() });

            err.kind === 'ObjectId' && res.status(200).json({
                error: true,
                code: 400,
                data: "Esta area no existe",
            });
        }
    }

    public exportExcel = async (req:Request, res:Response):Promise<void> => {

        try {

            // Traer todos los areas
            const areasBD = await Area.find({}, { __v:0 });
            
            const columns = [
                { header: 'Description', key: 'userName', width: 20 },
                { header: 'Active', key: 'name', width: 20 },
            ];

            generateExcel({
                nameExcel: 'excel-areas',
                headersExcel: columns,
                data: areasBD,
                res,
                setData: this.setData,
            });
        
        } catch(err:any) {
            
            console.log({ step: 'areasController exportExcel', error: err.toString() });
        }

    }
    
    private setData = (area:IArea):object => ({
        description: area.description,
        active:area.active,
    });
}

export const areasController = new Areas();