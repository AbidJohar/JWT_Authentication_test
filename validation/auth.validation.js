import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.alphanum": "Username must only contain letters and numbers",
            "string.min": "Username must be at least 3 characters",
            "string.max": "Username must be at most 30 characters",
            "any.required": "Username is required",
        }),

    fullname: Joi.string()
        .min(2)
        .max(60)
        .pattern(/^[a-zA-Z\s'-]+$/)
        .required()
        .messages({
            "string.min": "Full name must be at least 2 characters",
            "string.max": "Full name must be at most 60 characters",
            "string.pattern.base": "Full name contains invalid characters",
            "any.required": "Full name is required",
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .max(100)
        .required()
        .messages({
            "string.email": "Please provide a valid email address",
            "string.max": "Email must be at most 100 characters",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .min(8)
        .max(64)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password must be at most 64 characters",
            "string.pattern.base":
                "Password must contain uppercase, lowercase, number and special character",
            "any.required": "Password is required",
        }),
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .max(100)
        .required()
        .messages({
            "string.email": "Please provide a valid email address",
            "string.max": "Email must be at most 100 characters",
            "any.required": "Email is required",
        }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});