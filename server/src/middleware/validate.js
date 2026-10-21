export const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: errors[0]?.message || 'Validation failed',
        errors,
      });
    }
    req.body = result.data;
    next();
  } catch (error) {
    next(error);
  }
};
