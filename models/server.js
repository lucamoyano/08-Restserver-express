const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../db/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        
        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categories: '/api/categorias',
            productos:  '/api/productos',
            user:       '/api/usuarios'
        }

        // Conectar a base de datos
        this.dbConexion();

        // Middlewares
        this.middlewares();

        //Rutas
        this.routes();
    }

    async dbConexion() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {    
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categories, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.user, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, ()=> {
            console.log(`Servidor corriendo en`, this.port);
        });
    }
}

module.exports = Server;