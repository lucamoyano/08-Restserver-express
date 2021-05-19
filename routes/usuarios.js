const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, existeUsuarioId, emailExiste } = require('../helpers/db-validator');

const {
    validarCampos, 
    validarJWT, 
    validarAdminRol, 
    validarRol 
} = require('../middlewares');

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete 
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    // Preparar errores
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioId ), 
    check('rol').custom( esRoleValido ), 
    // Retornar errores
    validarCampos
],usuariosPut);

router.post('/',[
    // Preparar errores
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    check('password', 'El password debe tener mas de 6 caracteres').isLength({min: 6}), 
    check('correo', 'El correo no es válido').isEmail(), 
    check('correo').custom( emailExiste ), 
    check('rol').custom( esRoleValido ), 
    //Retornar errores,
    validarCampos 
],usuariosPost);

// Los middlewares se ejecutan en orden
// Lo seteado en req se puede obtener en los siguientes middleware
router.delete('/:id',[
    validarJWT,
    //validarAdminRol, // Validar si es admin para realizar acciones
    validarRol('ADMIN_ROLE','VENTAS_ROLE'), // Validar si tiene rol necesario para realizar accion
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioId ), 
    validarCampos 
] ,usuariosDelete);

module.exports = router;