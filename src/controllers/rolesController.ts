import { Request, Response } from 'express';

import { Rol } from '../models/Rol';

class Roles {

    public getRoles = async (req:Request, res:Response):Promise<void> => {

        const { limit } = req.query;

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

        try {

            const rolesBD = await Rol.find({}, { __v:0 }).limit(Number(limit));
        
            res.status(200).json({
                error: false,
                code: 200,
                data: rolesBD,
            });

        } catch(err:any) {

            console.log({ step: 'userController exportExcel', error: err.toString() });

            res.status(200).json({
                error: true,
                code: 500,
            });
        }
    }

    public createRol = async (req:Request, res:Response):Promise<void> => {

        try {
            
            const { id, name } = req.body;

            if (id.length === 0) delete req.body.id;

            const rolBD = new Rol(req.body);

            await rolBD.save();

            res.status(200).json({
                code: 200,
                error: false,
                data: "Rol creado con exito",
            });
        
        } catch(err:any) {
            
            console.log({ step: 'rolesController createRol', err: err.toString() });

            if ( err && err.code === 11000 ) res.status(200).json({
                error: true,
                code: 400,
                data: "El nombre del rol ya existe",
            });
        }
    }

    public updateRol = async (req:Request, res:Response):Promise<void> => {

        const { _id, ...update } = req.body;

        try {

            await Rol.findByIdAndUpdate(_id, update);

            res.status(200).json({
                code: 200,
                error: false,
                data: "Rol actualizado con exito",
            });
        
        } catch(err:any) {

            console.log({ step: 'rolesController updateRol', err: err.toString() });

            err.kind === 'ObjectId' && res.status(200).json({
                error: true,
                code: 400,
                data: "Este rol no existe",
            });

            if ( err && err.code === 11000 ) res.status(200).json({
                error: true,
                code: 400,
                data: "El nombre del rol ya existe",
            });
        }
    }
}

export const rolesController = new Roles();