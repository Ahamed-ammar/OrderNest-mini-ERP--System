import Joi from 'joi';

/**
 * Validation schema for creating delivery staff
 */
export const createDeliveryStaffSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'Name is required',
      'string.empty': 'Name cannot be empty'
    }),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits',
      'any.required': 'Phone number is required'
    })
});

/**
 * Validation schema for updating delivery staff
 */
export const updateDeliveryStaffSchema = Joi.object({
  name: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.empty': 'Name cannot be empty'
    }),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

/**
 * Validation schema for staff ID parameter
 */
export const staffIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid staff ID format'
    })
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

/**
 * Middleware to validate request params
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false
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
    
    req.params = value;
    next();
  };
};
