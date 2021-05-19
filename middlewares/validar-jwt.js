const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async(req, res, next) => {

    const token = req.header('x-api-token');
    
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try{
        // Verificar token válido
        //Obtener uid del usuario autenticado
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        // Consultamos usuario autenticado
        const usuario = await Usuario.findById( uid );

        // Verificar si el usuario existe
        if( !usuario ){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe'
            });
        }

        // Verificar si el uid tiene estado: true
        if ( !usuario.estado ){
            return res.status(401).json({
                msg: 'Token no válido - usuario estado: false'
            });
        }

        // Seteamos el Usuario autenticado
        // Para utilizarlo en los controladores siguientes del router
        req.usuario = usuario;

        next();
    } catch(error){

        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}


module.exports = {
    validarJWT
}