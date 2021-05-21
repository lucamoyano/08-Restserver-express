const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res) => {

    const { correo, password } = req.body;

    try{

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Si el usuario está activo
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuario.password )
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await  generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrdor'
        });
    };

}


const googleSignIn = async(req, res) => {
    
    const { id_token } = req.body;

    try {
        const { nombre, correo, img }= await googleVerify( id_token );
        
        let usuario = await Usuario.findOne({ correo });

        // Si el usuario no existe, lo creo. si no inicio sesión
        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password:'xD',
                img,
                google: true
            }
            usuario = new Usuario( data );
            await usuario.save();
        } 
        
        // Si el usuario en BD
        if ( !usuario.estado ) {
            res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });


    }catch{
        res.status(400).json({
            msg: 'Token de Google no válido'
        })
    }


}


module.exports = {
    login,
    googleSignIn
}