const { validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({ message: `Validation failed.
    Username: Must be 5 characters or more.
    Email: Must be a valid email.
    Password: Must be 6 characters or more.`, errors: errors.array() });
  };
};

module.exports = validate