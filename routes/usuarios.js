const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, existeUsuarioId, emailExiste } = require('../helpers/db-validator');
const { validarCampos } = require('../middlewares/validar-campos');

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

router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioId ), 
    validarCampos 
] ,usuariosDelete);

module.exports = router;