import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Document } from 'mongoose';

import { User } from '../models/User';
import { Rol } from '../models/Rol';
import { Area } from '../models/Areas';
import { roles, IRol } from '../utils/roles';
import { areas, IArea } from '../utils/areas';
import { modules } from '../utils/modules';
import { generateExcel } from '../utils/helper';

interface IUser {
    userName:string;
    name:string;
    email:string;
    area: { description:string };
    rol: { name:string };
    active:string;
}

class UserController {

    public getUsers = async (req:Request, res:Response):Promise<void> => {

        const { data, limit } = req.query;

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

        const text:string = data as string;
        const regex = new RegExp(text, "g");
        
        const usersBD = await User.find({
            $or: [{userName: regex}, {userName: regex}, {name: regex}, {email: regex}, {nameRol: regex}, {nameArea: regex}],
            $and: [{ active: true }],
        }, { __v:0, modules:0, password:0, tokenURL:0, nameRol:0, nameArea:0 }).limit(Number(limit)).populate('rol area', 'name _id description');
        
        res.status(200).json({
            error: false,
            code: 200,
            data: usersBD,
        });
    }

    public createUser = async (req:Request, res:Response):Promise<void> => {

        const { idRol, idArea, userName, email, password, name } = req.body;
        
        const accessModules = modules.filter(({access}) => access.includes( idRol ));
        const deletePropAcces = accessModules.map(({access, ...obj}) => obj);

        const userBD = new User({
            name,
            email,
            password: bcrypt.hashSync(password, 12),
        });

        const rol = await Rol.findById(idRol, {__v:0});        
        const area = await Area.findById(idArea, {__v:0});

        userName && (userBD.userName = userName);

        userBD.rol = idRol;
        userBD.nameRol = rol.name;
        userBD.nameArea = area.description;
        userBD.area = idArea;
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

        const accessModules = modules.filter(({access}) => access.includes( idRol ));
        const deletePropAcces = accessModules.map(({access, ...obj}) => obj);

        const rol = await Rol.findById(idRol, {__v:0});        
        const area = await Area.findById(idArea, {__v:0});
        
        update.rol = idRol;
        update.nameRol = rol.name;
        update.area = idArea;
        update.nameArea = area.description;
        update.modules = deletePropAcces;
        userName && (update.userName = userName);

        try {

            await User.findByIdAndUpdate(id, update);

            res.status(200).json({
                error: false,
                code: 200,
                data: "Usuario actualizado con exito",
            });
        
        } catch(err:any) {

            console.log({ step: 'userController updateUser', err: err.toString() });

            err.kind === 'ObjectId' && res.status(200).json({
                error: true,
                code: 400,
                data: "Este usuario no existe",
            });

            (err.codeName === 'DuplicateKey' && err.keyPattern['email']) && res.status(200).json({
                error: true,
                code: 400,
                data: "El Email ya existe",
            });

            (err.codeName === 'DuplicateKey' && err.keyPattern['userName']) && res.status(200).json({
                error: true,
                code: 400,
                data: "El userName ya existe",
            });
        }
    }

    public deleteUser = async (req:Request, res:Response):Promise<void> => {

        const { id } = req.params;
        
        try {

            await User.findByIdAndUpdate(id, {active: false});

            res.status(200).json({
                error: false,
                code: 200,
                data: "Usuario eliminado con exito",
            });
        
        } catch(err:any) {

            console.log({ step: 'userController deleteUser', err: err.toString() });

            err.kind === 'ObjectId' && res.status(200).json({
                error: true,
                code: 400,
                data: "Este usuario no existe",
            });
        }
    }

    public exportExcel = async (req:Request, res:Response):Promise<void> => {

        try {

            // Traer todos los usuarios
            const usersBD = await User.find({}, { __v:0, modules:0, password:0, tokenURL:0, nameRol:0, nameArea:0 }).populate('rol area', 'name _id description');

            const columns = [
                { header: 'UserName', key: 'userName', width: 20 },
                { header: 'Name', key: 'name', width: 20 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Area', key: 'area', width: 20 },
                { header: 'Permisos', key: 'permits', width: 20 },
                { header: 'Activo', key: 'active', width: 10 },
            ];

            generateExcel({
                nameExcel: 'excel-users',
                headersExcel: columns,
                data: usersBD,
                res,
                setData: this.setData,
            });
        
        } catch(err:any) {
            
            console.log({ step: 'userController exportExcel', error: err.toString() });
        }
    }

    private setData = (user:IUser):object => ({
        userName: user.userName,
        name: user.name,
        email: user.email,
        area: user?.area.description || "",
        permits: user?.rol?.name || "",
        active: user.active ? 'Activo' : 'Inactivo',
    });
}

export const user = new UserController();