const express = require('express');
const cors = require('cors');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.userPath = '/api/usuarios';


        // Middlewares
        this.middlewares();

        //Rutas
        this.routes();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {    
        this.app.use(this.userPath, require('../routes/usuarios'));

    }

    listen() {
        this.app.listen(this.port, ()=> {
            console.log(`Servidor corriendo en`, this.port);
        });
    }
}

module.exports = Server;