const { Router } = require('express');
const { check } = require('express-validator');

const { existeProducto, existeCategoria } = require('../helpers/db-validator');

const {
    validarCampos, 
    validarJWT, 
    validarAdminRol, 
    validarRol 
} = require('../middlewares');

const { 
    crearProducto, 
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');

const router = Router();

// Obtener todas las Productos
router.get('/', obtenerProductos);

// Obtener una Producto por id - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
],obtenerProducto);

router.post('/',[ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(), 
    check('categoria').custom(  existeCategoria ),
    validarCampos
], crearProducto);

router.put('/:id',[
    validarJWT,
    validarRol('ADMIN_ROLE','VENTAS_ROLE'), // Validar si tiene rol necesario para realizar accion
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    check('categoria').custom(  existeCategoria ),
    validarCampos
] ,actualizarProducto);

// Borrar una Producto - Admin
router.delete('/:id',[
    validarJWT,
    validarAdminRol,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
],borrarProducto);


module.exports = router;