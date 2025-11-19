const supabase = require('../config/supabase');

// Obtener todas las categorías
const getAllCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return res.status(400).json({ 
        message: 'Error al obtener categorías', 
        error: error.message 
      });
    }

    res.json({
      message: 'Categorías obtenidas exitosamente',
      categories: data
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

// Obtener productos por categoría
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', categoryName)
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

module.exports = {
  getAllCategories,
  getProductsByCategory
};
