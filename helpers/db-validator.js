const Role = require('../models/role');
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');



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

// Verificar si existe categoria
const existeCategoria = async(id) => {
    const categoria = await Categoria.findById(id);    

    if ( !categoria ) {
        throw new Error(`La categoria ingresada no existe`); 
    }
}

// Verificar si existe producto
const existeProducto = async(id) => {
    const producto = await Producto.findById(id);    

    if ( !producto ) {
        throw new Error(`El producto ingresado no existe`); 
    }
}

// Validar coleccion permitida
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida){
        throw new Error(`La coleccioón ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}