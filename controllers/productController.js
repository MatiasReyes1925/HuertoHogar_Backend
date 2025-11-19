const supabase = require('../config/supabase');

// CREATE - Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const userId = req.userId; // Del middleware de autenticación

    // Validar campos requeridos
    if (!name || !price) {
      return res.status(400).json({ 
        message: 'Nombre y precio son requeridos' 
      });
    }

    // Validar que el precio sea un número positivo
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ 
        message: 'El precio debe ser un número positivo' 
      });
    }

    // Validar que el stock sea un número no negativo si se proporciona
    if (stock !== undefined && (isNaN(stock) || parseInt(stock) < 0)) {
      return res.status(400).json({ 
        message: 'El stock debe ser un número no negativo' 
      });
    }

    // Insertar producto
    const { data, error } = await supabase
      .from('products')
      .insert([
        { 
          name, 
          description, 
          price, 
          stock: stock || 0,
          user_id: userId 
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ 
        message: 'Error al crear producto', 
        error: error.message 
      });
    }

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: data
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

// READ - Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ 
        message: 'Error al obtener productos', 
        error: error.message 
      });
    }

    res.json({
      message: 'Productos obtenidos exitosamente',
      products: data,
      count: data.length
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

// READ - Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    // Si hay un error que no sea "no encontrado", es un error real
    if (error && error.code !== 'PGRST116') {
      return res.status(400).json({ 
        message: 'Error al buscar producto', 
        error: error.message 
      });
    }

    if (!data) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }

    res.json({
      message: 'Producto obtenido exitosamente',
      product: data
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

// UPDATE - Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const userId = req.userId;

    // Verificar que el producto existe y pertenece al usuario
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('user_id')
      .eq('id', id)
      .single();

    // Si hay un error que no sea "no encontrado", es un error real
    if (fetchError && fetchError.code !== 'PGRST116') {
      return res.status(400).json({ 
        message: 'Error al buscar producto', 
        error: fetchError.message 
      });
    }

    if (!existingProduct) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }

    // Verificar permisos (solo el dueño o admin puede actualizar)
    if (existingProduct.user_id !== userId && req.userRole !== 'admin') {
      return res.status(403).json({ 
        message: 'No tienes permiso para actualizar este producto' 
      });
    }

    // Validar que el precio sea un número positivo si se proporciona
    if (price !== undefined && (isNaN(price) || parseFloat(price) <= 0)) {
      return res.status(400).json({ 
        message: 'El precio debe ser un número positivo' 
      });
    }

    // Validar que el stock sea un número no negativo si se proporciona
    if (stock !== undefined && (isNaN(stock) || parseInt(stock) < 0)) {
      return res.status(400).json({ 
        message: 'El stock debe ser un número no negativo' 
      });
    }

    // Actualizar producto
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ 
        message: 'Error al actualizar producto', 
        error: error.message 
      });
    }

    res.json({
      message: 'Producto actualizado exitosamente',
      product: data
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

// DELETE - Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verificar que el producto existe
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('user_id')
      .eq('id', id)
      .single();

    // Si hay un error que no sea "no encontrado", es un error real
    if (fetchError && fetchError.code !== 'PGRST116') {
      return res.status(400).json({ 
        message: 'Error al buscar producto', 
        error: fetchError.message 
      });
    }

    if (!existingProduct) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }

    // Verificar permisos
    if (existingProduct.user_id !== userId && req.userRole !== 'admin') {
      return res.status(403).json({ 
        message: 'No tienes permiso para eliminar este producto' 
      });
    }

    // Eliminar producto
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ 
        message: 'Error al eliminar producto', 
        error: error.message 
      });
    }

    res.json({
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

// Obtener productos del usuario actual
const getMyProducts = async (req, res) => {
  try {
    const userId = req.userId;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ 
        message: 'Error al obtener tus productos', 
        error: error.message 
      });
    }

    res.json({
      message: 'Productos obtenidos exitosamente',
      products: data,
      count: data.length
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts
};
