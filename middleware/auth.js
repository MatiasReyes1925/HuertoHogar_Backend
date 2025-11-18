const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(403).json({ 
      message: 'Token de autenticación requerido' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Token inválido o expirado' 
    });
  }
};

// Middleware para verificar roles específicos
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({ 
        message: 'Usuario no autenticado' 
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ 
        message: 'No tienes permisos para acceder a este recurso' 
      });
    }

    next();
  };
};

module.exports = { verifyToken, checkRole };
