const { z } = require('zod');

const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
        }))
      });
    }
    next(err);
  }
};

module.exports = { validateRequest };
