const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, existeUsuarioId, emailExiste, existeCategoria } = require('../helpers/db-validator');

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
    actualizarCategoria
} = require('../controllers/categorias');

const router = Router();

// Obtener todas las categorias
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id',[
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
    check('id').custom( existeCategoria ),
    validarCampos
] ,actualizarCategoria);

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    check('id').custom( existeCategoria ),
    validarCampos
],(req, res) => {
    res.json('get')
});


module.exports = router;