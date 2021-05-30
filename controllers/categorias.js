const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req, res) => {
    // Paginación
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true}

   const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde)) 
            .limit(Number(limite))
            .populate('usuario')
    ]);

    res.json({
        total,
        categorias
    })
};

// obtenerCategoria - populate - {}
const obtenerCategoria = async(req, res) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario');

    res.json({
        categoria
    })
};

const crearCategoria = async(req, res) => {
    const nombre = req.body.nombre.toUpperCase();

    // Obtener categoria 
    const categoriaDB = await Categoria.findOne({ nombre });
    // Si la categoria existe retorno error
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: 'La categoria ya existe'
        })
    }
    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
    }
    const categoria = new Categoria( data );
    // Guardar DB
    await categoria.save();
    res.status(201).json(categoria);
};

// actualizarCategoria 
const actualizarCategoria = async(req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    const existeCategoria = await Categoria.find({nombre});
    if( existeCategoria ) {
        res.status(400).json({
            msg: 'El nombre de categoria ingresado ya existe'
        })
    }
    const categoria = await Categoria.findOneAndUpdate(id, nombre);

    res.json(
        categoria
    )
}

// borrarCategoria - estado: false

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria
}