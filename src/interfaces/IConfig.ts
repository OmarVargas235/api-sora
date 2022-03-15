import { Response } from 'express';

export interface IOptions {
    email:string;
    subject:string;
    url:string;
    token:string;
}

export interface IModule {
    access: [string, ...number[]];
    icon:string;
    module:string;
    id:number|string;
    programs:[...string[], object];
}

export interface IGenerateExcel {
    nameExcel:string;
    headersExcel:{ header: string; key: string; width: number; }[];
    data:object[];
    res:Response;
    setData:(data:any)=>object;
}