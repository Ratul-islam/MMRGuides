import Joi from "joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const messExpenseSchema = Joi.object({
  user: Joi.array()
    .items(Joi.string().custom(objectId).required())
    .min(1)
    .required()
    .messages({
      "array.base": `"user" must be an array of user IDs`,
      "array.min": `"user" must contain at least one user ID`,
      "any.required": `"user" is required`,
      "any.invalid": `"user" must be valid ObjectId(s)`,
    }),

  mess: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      "any.required": `"mess" is required`,
      "any.invalid": `"mess" must be a valid ObjectId`,
    }),

  amount: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": `"amount" must be a number`,
      "number.min": `"amount" cannot be negative`,
      "any.required": `"amount" is required`,
    }),

  description: Joi.string()
    .allow("")
    .messages({
      "string.base": `"description" must be a string`,
    }),

  createdAt: Joi.date()
    .optional()
    .messages({
      "date.base": `"createdAt" must be a valid date`,
    }),
});
