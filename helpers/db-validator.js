const Role = require('../models/role');
const Usuario = require('../models/usuario');

// Verificar si el rol es valido
const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if( !existeRol ) {
        throw new Error(`El rol ${rol} no es valido`) 
    }
}

// Verificar si correo existe
const emailExiste = async(correo = '') => {
    const email = await Usuario.findOne({ correo });
    if ( email ) {
        throw new Error(`El correo ${correo} ya está registrado`); 
    }
}

// Verificar si _id existe
const existeUsuarioId = async(id) => {
    /* Error de casteo con algunos _id en version mongo db - corregir*/
    const existeUsuario = await Usuario.findById(id);
    
    if ( !existeUsuario ) {
        throw new Error(`El id ingresado no existe`); 
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioId
}