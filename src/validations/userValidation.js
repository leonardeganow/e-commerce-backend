import Joi from "joi";

export const registerUserValidation = Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.base": `Name should be a type of text`,
        "string.empty": `Name cannot be empty`,
        "string.min": `Name should have at least {#limit} characters`,
        "string.max": `Name should have at most {#limit} characters`,
        "any.required": `Name is required`,
      }),
    address: Joi.string()
      .min(10)
      .max(255)
      .required()
      .messages({
        "string.base": `Address should be a type of text`,
        "string.empty": `Address cannot be empty`,
        "string.min": `Address should have at least {#limit} characters`,
        "string.max": `Address should have at most {#limit} characters`,
        "any.required": `Address is required`,
      }),
    contactNumber: Joi.string()
      .pattern(/^\+?\d{7,15}$/)
      .required()
      .messages({
        "string.empty": `Contact Number cannot be empty`,
        "string.pattern.base": `Contact Number must be a valid phone number with 7 to 15 digits`,
        "any.required": `Contact Number is required`,
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": `Email must be a valid email address`,
        "string.empty": `Email cannot be empty`,
        "any.required": `Email is required`,
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        "string.empty": `Password cannot be empty`,
        "string.min": `Password should have at least {#limit} characters`,
        "any.required": `Password is required`,
      }),
    type: Joi.string()
      .valid("customer", "admin",)
      .required()
      .messages({
        "any.only": `Type must be one of [customer, admin]`,
        "any.required": `Type is required`,
      }),
  });
