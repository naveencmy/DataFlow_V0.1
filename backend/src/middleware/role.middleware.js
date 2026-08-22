/**
 * Role-based access control middleware.
 * Must be used AFTER protect middleware.
 */

// Only allow ADMIN role
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Administrator access required.',
    });
  }
  next();
};

// Allow ADMIN or the employee accessing their own resource
export const requireSelfOrAdmin = (req, res, next) => {
  const { id } = req.params;
  const isAdmin = req.user?.role === 'ADMIN';
  const isSelf = req.user?.employeeId?.toString() === id;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. You can only access your own records.',
    });
  }
  next();
};
