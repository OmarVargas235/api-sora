import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { routesAuth } from './routes/auth';

class Server {

    private app: Application;
    private port: string|undefined;

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.config();
        this.routes();
    }

    config():void {

        // COnfiguracion de la base de datos
        mongoose.connect('mongodb://localhost:27017/sora-app')
            .then(() => console.log("base de datos activa") )
            .catch(error => console.log("a ocurrido un error", console.error() ));

        this.app.use( express.json() );
        this.app.use( express.urlencoded( { extended: false } ) );

        // Configuracion de cors
        this.app.use ( cors() );
    }

    routes():void {
        
        this.app.use( "/api/auth", routesAuth.getRouter() );
    }

    start():void {

        this.app.listen( this.port, () => console.log(`Corriendo en el puerto ${this.port}`) );
    }
}

export const server = new Server();