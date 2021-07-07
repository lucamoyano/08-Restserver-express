
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_NAME, 
//   api_key: process.env.CLOUDINARY_KEY, 
//   api_secret: process.env.CLOUDINARY_SECRET
// });


const { uploadFile }  = require('../helpers');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async(req, res) => {
  // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
  //   res.status(400).json({msg: 'No hay archivos que subir'});
  //   return;
  // }

  try {
    // Imagenes
    const nombre = await uploadFile({files:req.files, folder:'images'});
    res.json({ nombre });

  } catch (msg) {
    res.status(400).json(msg)
  }
  
}

const actualizarImagen = async(req, res) => {

  const { id, coleccion } = req.params;
  let modelo;

  switch ( coleccion ){
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
          return res.status(400).json({
            msg: 'No existe un usuario con ese id'
        });
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo){
          return res.status(400).json({
            msg: 'No existe un producto con ese id'
        });
      }
    break;
    
    default:
      return res.status(500).json({msg: 'Se me olvidó validar esto'});
  }

  // Limpiar imágenes previas
  if ( modelo.img ) {
    // Hay que borrar la img del Servidor
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if (fs.existsSync(pathImagen)){
      fs.unlinkSync(pathImagen); //Borrar archivo
    }
  }

  const nombre = await uploadFile({files:req.files, folder:coleccion});
  modelo.img = nombre;

  await modelo.save();

  res.json( modelo );

}

const mostrarImagen = async(req, res) => {
  const { id, coleccion } = req.params;

   let modelo;

  switch ( coleccion ){
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
          return res.status(400).json({
            msg: 'No existe un usuario con ese id'
        });
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo){
          return res.status(400).json({
            msg: 'No existe un producto con ese id'
        });
      }
    break;
    
    default:
      return res.status(500).json({msg: 'Se me olvidó validar esto'});
  }

  
  // Limpiar imágenes previas
  if ( modelo.img ) {
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if (fs.existsSync(pathImagen)){
      return res.sendFile(pathImagen); //retornar img
    }
  }

  const pathNoImage = path.join( __dirname, '../assets/no-image.jpg' );
  res.sendFile(pathNoImage) //error en caso de no tener img
}

const actualizarImagenCloudinary = async(req, res) => {
  
  const { id, coleccion } = req.params;
  let modelo;

  switch ( coleccion ){
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
          return res.status(400).json({
            msg: 'No existe un usuario con ese id'
        });
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo){
          return res.status(400).json({
            msg: 'No existe un producto con ese id'
        });
      }
    break;
    
    default:
      return res.status(500).json({msg: 'Se me olvidó validar esto'});
  }

  // Limpiar imágenes previas
  if ( modelo.img ) {
    cloudinary.uploader.destroy( modelo.img_id )
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url, public_id } = await cloudinary.uploader.upload( tempFilePath, {folder:`RestServer_NodeJs/${coleccion}`} );
  //const resp = await cloudinary.uploader.upload( tempFilePath );
  //console.log(resp);
  modelo.img = secure_url;
  modelo.img_id = public_id;

  await modelo.save();

  res.json( modelo );

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}