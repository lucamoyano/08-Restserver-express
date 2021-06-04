
const dbValidator = require('./db-validator');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const uploadFile = require('./upload-file');

module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...googleVerify,
    ...uploadFile
}