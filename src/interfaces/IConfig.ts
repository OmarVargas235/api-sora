export interface IOptions {
    email:string;
    subject:string;
    url:string;
    token:string;
}

export interface IModule {
    access: number[];
    icon:string;
    module:string;
    id:number|string;
    programs:[...string[], object];
}