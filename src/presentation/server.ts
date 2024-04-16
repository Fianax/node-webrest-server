import express, { Router, response } from 'express';
import compression from 'compression';
import path from 'path';

interface Options {
    port: number;
    routers: Router;
    public_path?: string;
}

export class Server {

    private app = express();
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: Options){
        this.port = options.port;
        this.publicPath = options.public_path ?? 'public';
        this.routes = options.routers;
    }

    async start(){

        //* Middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true})); // x-www-form-urlencoded
        this.app.use(compression());

        //* Public folder
        this.app.use(express.static(this.publicPath));

        //* Routes
        this.app.use(this.routes)

        //* SPA
        this.app.get('*', (req, res) => {
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);
            return;
        });
        
        this.app.listen(this.port, () => {
            console.log(`Server running port ${this.port}`);
        })
    }
}