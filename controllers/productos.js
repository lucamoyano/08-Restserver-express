const { Producto } = require('../models');


const obtenerProductos = async(req, res) => {
    // Paginación
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true}

   const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde)) 
            .limit(Number(limite))
            .populate('usuario categoria')
    ]);

    res.json({
        total,
        productos
    })
};

const obtenerProducto = async(req, res) => {
    const { id } = req.params;

    const producto = await Producto.findById(id).populate('usuario categoria');

    res.json({
        producto
    })
};

const crearProducto = async(req, res) => {
    const {  precio, descripcion, categoria, disponible } = req.body;
    const  nombre  = req.body.nombre.toUpperCase();

    // Obtener Producto 
    const productoDB = await Producto.findOne({ nombre });
    console.log(productoDB)
    // Si el Producto existe retorno error
    if ( productoDB ) {
        return res.status(400).json({
            msg: 'El producto ya existe'
        })
    }

    
    // Generar la data a guardar
    const data = {
        nombre,
        precio, 
        descripcion, 
        categoria, 
        disponible,
        usuario: req.usuario._id, // Usuario 
    }

    const producto = new Producto( data );
    
    // Guardar DB
    await producto.save();
    res.status(201).json(producto);
};

const actualizarProducto = async(req, res) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    
    data.nombre = data.nombre.toUpperCase();

    const productoDB = await Producto.findOne({nombre: data.nombre});
    
    // Si el nombre de Producto existe retorno error
    if ( productoDB ) {
        return res.status(400).json({
            msg: 'El Producto ya existe'
        })
    }    
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, {new : true} );
    //new: true -> para devolver valores actualizados

    res.json(
        producto
    )
}

const borrarProducto = async(req, res) => {
    const { id } = req.params;
    const usuarioAutenticado = req.usuario;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false})
    res.json({
        producto,
        usuarioAutenticado
    })

}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}