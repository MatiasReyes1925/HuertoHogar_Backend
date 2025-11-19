const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token después de "Bearer "

  console.log('🔍 Auth Header:', authHeader); // Debug
  console.log('🔑 Token extraído:', token); // Debug

  if (!token) {
    return res.status(403).json({ 
      message: 'Token de autenticación requerido' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decodificado:', decoded); // Debug
    
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('❌ Error verificando token:', error.message); // Debug
    return res.status(401).json({ 
      message: 'Token inválido o expirado',
      error: error.message 
    });
  }
};

// Middleware para verificar roles específicos
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('🎭 Verificando rol:', req.userRole); // Debug
    console.log('🎭 Roles permitidos:', allowedRoles); // Debug
    
    if (!req.userRole) {
      return res.status(401).json({ 
        message: 'Usuario no autenticado' 
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ 
        message: 'No tienes permisos para acceder a este recurso',
        yourRole: req.userRole,
        requiredRoles: allowedRoles
      });
    }

    next();
  };
};

module.exports = { verifyToken, checkRole };
