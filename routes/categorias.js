const { Router } = require('express');
const { check } = require('express-validator');

const { existeCategoria } = require('../helpers/db-validator');

const {
    validarCampos, 
    validarJWT, 
    validarAdminRol, 
    validarRol 
} = require('../middlewares');

const { 
    crearCategoria, 
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');

const router = Router();

// Obtener todas las categorias
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
],obtenerCategoria);

// Crear categoria - privado - cualquier persona con token valido
router.post('/',[ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    validarRol('ADMIN_ROLE','VENTAS_ROLE'), // Validar si tiene rol necesario para realizar accion
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
] ,actualizarCategoria);

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    validarAdminRol,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
],borrarCategoria);


module.exports = router;