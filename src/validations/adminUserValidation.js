import Joi from "joi";

export const adminValidationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Validates email format
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Invalid email format.",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
  }),
  role: Joi.string().valid("admin").required().messages({
    "string.empty": "Role is required.",
    "any.only": "Role must be 'admin'.",
  }),
});
