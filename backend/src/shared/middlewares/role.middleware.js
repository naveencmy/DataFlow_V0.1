import { ForbiddenError, UnauthorizedError } from '../errors/AppError.js';

/**
 * Enforces Role-Based Access Control (RBAC)
 * @param {string[]} allowedRoles Array of roles e.g. ['ADMIN', 'HR']
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('User authentication context not found'));
    }

    const userRole = (req.user.role || '').toUpperCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

    if (!normalizedAllowed.includes(userRole)) {
      return next(
        new ForbiddenError(
          `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${userRole}`
        )
      );
    }

    next();
  };
}

export default requireRole;
