const { uploadFile }  = require('../helpers');

const cargarArchivo = async(req, res) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({msg: 'No hay archivos que subir'});
    return;
  }

  try {
    // Imagenes
    const nombre = await uploadFile({files:req.files, folder:'images'});
    res.json({ nombre });
  } catch (msg) {
    res.status(400).json(msg)
  }
  
}


module.exports = {
    cargarArchivo
}