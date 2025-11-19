const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const supabase = require('../config/supabase');

// Todas estas rutas requieren autenticación
router.use(verifyToken);

// Obtener perfil del usuario actual
router.get('/me', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, username, role, created_at')
      .eq('id', req.userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      message: 'Perfil obtenido exitosamente',
      user: data
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
});

// Obtener todos los usuarios (solo admin)
router.get('/', checkRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, username, role, created_at');

    if (error) {
      return res.status(400).json({ 
        message: 'Error al obtener usuarios', 
        error: error.message 
      });
    }

    res.json({
      message: 'Usuarios obtenidos exitosamente',
      users: data,
      count: data.length
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
});

module.exports = router;
