const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( { files, extensionesValidas = ['png','jpg','jpeg','gif'], folder = ''} ) => {

    return new Promise((resolve, reject) => {
        
        const { archivo } = files;
        const splitNombre = archivo.name.split('.');
        const extension = splitNombre[ splitNombre.length - 1];

        // Validar la extension

        if( !extensionesValidas.includes( extension ) ){
            return rejec(`La extension ${extension} no es permitida: ${extensionesValidas}`);
        }

        // Nuevo nombre de archivo
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder , nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
        });
    })

}

module.exports = {
    uploadFile
}