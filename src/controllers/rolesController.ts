import { Request, Response } from 'express';

import { Rol } from '../models/Rol';

class Roles {

    public getRoles = async (req:Request, res:Response):Promise<void> => {

        const { name, quantity, page } = req.query;

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

        let rolesBD = await Rol.find({ name }, { __v:0 })
            .limit( Number(quantity) ).skip( Number(page)-1 );

        rolesBD = rolesBD.length === 0
            ?  await Rol.find({}, { __v:0 }).limit( Number(quantity) ).skip( Number(page)-1 )
            : rolesBD;
        
        res.status(200).json({
            error: false,
            code: 200,
            data: rolesBD,
        });
    }

    public createRol = async (req:Request, res:Response):Promise<void> => {

        const rolBD = new Rol(req.body);

        await rolBD.save();

        res.status(200).json({
            code: 200,
            error: false,
            data: "Rol creado con exito",
        });
    }

    public updateRol = async (req:Request, res:Response):Promise<void> => {

        const { id, ...update } = req.body;

        try {

            await Rol.findByIdAndUpdate(id, update);

            res.status(200).json({
                code: 200,
                error: false,
                data: "Rol actualizado con exito",
            });
        
        } catch(err:any) {

            err.kind === 'ObjectId' && res.status(200).json({
                error: true,
                code: 400,
                data: "Este rol no existe",
            });
        }
    }
}

export const rolesController = new Roles();