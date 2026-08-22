import { ValidationError } from '../errors/AppError.js';

/**
 * Higher-order middleware to validate req.body, req.query, or req.params using Zod
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(new ValidationError('Validation failed for request ' + source, formattedErrors));
      }
      return next(new ValidationError(error.message));
    }
  };
}

export default validate;
