const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar usuario
const register = async (req, res) => {
  try {
    const { email, password, username, role = 'user' } = req.body;

    // Validar campos requeridos
    if (!email || !password || !username) {
      return res.status(400).json({ 
        message: 'Email, password y username son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ 
        message: 'El email ya está registrado' 
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario en la base de datos
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          email, 
          password: hashedPassword, 
          username, 
          role 
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ 
        message: 'Error al registrar usuario', 
        error: error.message 
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: data.id, email: data.email, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: data.id,
        email: data.email,
        username: data.username,
        role: data.role
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y password son requeridos' 
      });
    }

    // Buscar usuario por email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

module.exports = { register, login };
