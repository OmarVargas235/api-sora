import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { routesAuth } from './routes/auth';
import { routerUser } from './routes/user';
import { routerAreas } from './routes/areas';
import { routerRoles } from './routes/roles';
import { routerGlobals } from './globals/routes';

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

        // Configuracion de la base de datos
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
        this.app.use( "/api/config",
            routerUser.getRouter(),
            routerAreas.getRouter(),
            routerRoles.getRouter(),
        );
        this.app.use( "/api/globals", routerGlobals.getRouter() );
    }

    start():void {

        this.app.listen( this.port, () => console.log(`Corriendo en el puerto ${this.port}`) );
    }
}

export const server = new Server();