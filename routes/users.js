const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const supabase = require('../config/supabase');

// Todas estas rutas requieren autenticación
router.use(verifyToken);

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

// Cambiar rol de usuario (solo admin)
router.put('/:id/role', checkRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validar que el rol sea válido
    const validRoles = ['admin', 'moderator', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Rol inválido. Opciones: admin, moderator, user' 
      });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select('id, email, username, role')
      .single();

    if (error || !data) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      message: 'Rol actualizado exitosamente',
      user: data
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', checkRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Evitar que el admin se elimine a sí mismo
    if (id === req.userId) {
      return res.status(400).json({ 
        message: 'No puedes eliminar tu propia cuenta' 
      });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ 
        message: 'Error al eliminar usuario', 
        error: error.message 
      });
    }

    res.json({
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
});

module.exports = router;
