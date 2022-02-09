import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Document } from 'mongoose';

import { User } from '../models/User';
import { roles, IRol } from '../utils/roles';
import { areas, IArea } from '../utils/areas';
import { modules } from '../utils/modules';

class UserController {

    public createUser = async (req:Request, res:Response):Promise<void> => {

        const { idRol, idArea, userName, email, password, name } = req.body;

        const rol:IRol|undefined = roles.find(({id}:IRol) => id === Number(idRol));
        const area:IArea|undefined = areas.find(({id}:IArea) => id === Number(idArea));
        const accessModules = modules.filter(({access}) => access.includes( Number(idRol) ));
        const deletePropAcces = accessModules.map(({access, ...obj}) => obj);

        const userBD = new User({
            name,
            email,
            password: bcrypt.hashSync(password, 12),
        });

        userName && (userBD.userName = userName);

        userBD.rol = rol?.name;
        userBD.idRol = rol?.id;
        userBD.area = area;
        userBD.modules = deletePropAcces;

        try {

            await userBD.save();

            res.status(200).json({
                error: false,
                code: 200,
                data: "Usuario registrado con exito",
            });
        
        } catch(err:any) {

            if ( err && err.code === 11000 ) res.status(200).json({
                error: true,
                code: 400,
                data: "Este usuario ya existe",
            });
        }
    }

    public updateUser = async (req:Request, res:Response):Promise<void> => {

        const { id, idRol, idArea, userName, ...update } = req.body;

        const rol:IRol|undefined = roles.find(({id}:IRol) => id === Number(idRol));
        const area:IArea|undefined = areas.find(({id}:IArea) => id === Number(idArea));
        const accessModules = modules.filter(({access}) => access.includes( Number(idRol) ));
        const deletePropAcces = accessModules.map(({access, ...obj}) => obj);
        
        update.rol = rol?.name;
        update.idRol = rol?.id;
        update.area = area;
        update.modules = deletePropAcces;
        userName && (update.userName = userName);

        try {

            const userBD = await User.findByIdAndUpdate(id, update);

            res.status(200).json({
                error: false,
                code: 200,
                data: "Usuario actualizado con exito",
            });
        
        } catch(err:any) {

            err.kind === 'ObjectId' && res.status(200).json({
                error: true,
                code: 400,
                data: "Este usuario no existe",
            });
        }
    }
}

export const user = new UserController();