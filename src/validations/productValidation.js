import Joi from "joi";


export const addProductValidation = Joi(
    {
        name: Joi.string().required(),
        description: Joi.string().allow(""),
        price: Joi.number().required(),
        currency: Joi.string().valid("GHS", "USD", "EUR").default("GHS"), // Adjust valid currencies as needed
        stock: Joi.number().integer().min(0).required(),
        featured: Joi.boolean().default(false),
        category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), // MongoDB ObjectId validation
        image: Joi.string().uri().allow(""), // Ensure valid URL if provided
        colors: Joi.array().items(Joi.string()).default([]), // Array of strings
        sizes: Joi.array().items(Joi.string()).default([]),  // Array of strings
    }
)