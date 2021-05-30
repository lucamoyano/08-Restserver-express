const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req, res) => {
    
    // Paginación
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true}

    // const usuarios = await Usuario.find(query)
    // .skip(Number(desde)) //Traer usuarios desde
    // .limit(Number(limite)); //Traer usuarios limitados

    // const total = await Usuario.countDocuments(query);

    /*Crear colección de promesas*/
    /*Cuando un await no depende de otro*/
    /*En este caso el await del total, no depende esperar al await de usuarios*/
    /*Se ejecutan los 2 await al mismo tiempo, y espera la resolucion de ambas*/
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde)) 
            .limit(Number(limite))
    ]);


    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async(req, res) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;
    

    if ( password ) {
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync( password, salt);
    }

    // Actualizar datos menos los datos de google, correo, _id
    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const usuariosPost = async(req, res) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync( password, salt);

    //Guardar en DB
    await usuario.save();

    res.json({ 
        usuario
    });
}

const usuariosDelete = async(req, res) => {

    const { id } = req.params;
    
    // Lo borramos fisicamente
    // const usuario = await Usuario.findByIdAndDelete( id );

    // Usuario autenticado que hizo el delete
    // Recibimos lo seteado en 'validar-jwt'
    const usuarioAutenticado = req.usuario;

    // "Borrado" cambiar estado a false
    const usuario = await Usuario.findByIdAndUpdate( id, {estado: false} );

    res.json({ 
        usuario,
        usuarioAutenticado
    });
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}