import Joi from 'joi';
import { STREET_TYPES } from '../config/constants.js';

/**
 * Schema for updating customer profile
 */
export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).optional(),
  streetType: Joi.string().valid(...Object.values(STREET_TYPES)).optional(),
  houseName: Joi.string().trim().min(1).max(200).optional(),
  doorNo: Joi.string().trim().min(1).max(50).optional(),
  landmark: Joi.string().trim().max(200).allow('').optional()
});

/**
 * Middleware to validate request body
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors
        }
      });
    }

    req.body = value;
    next();
  };
};
