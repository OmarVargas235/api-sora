export interface IOptions {
    email:string;
    subject:string;
    url:string;
    token:string;
}

export interface IModule {
    icon:number,
    module:string,
    programs:[...string[], object],
}