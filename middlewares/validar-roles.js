

// Verificar si el usuario es admin para realizar acciones
const validarAdminRol = (req, res, next) => {

    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token antes'
        });
    }

    const { rol } = req.usuario;
    if( rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: 'No tiene permisos para realizar esta acción'
        });
    }

    next();
}

const validarRol = ( ...roles ) => {
    return (req, res, next) => {
        
        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token antes'
            });
        }

        if( !roles.includes(req.usuario.rol) ){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();
    }
}



module.exports = {
    validarAdminRol,
    validarRol
}