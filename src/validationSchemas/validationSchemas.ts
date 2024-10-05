import Joi from "joi";

export const languageConfigValidationSchema = Joi.object({
    singleLineComment: Joi.string().required(),
    multiLineCommentStart: Joi.string().optional(),
    multiLineCommentEnd: Joi.string().optional(),
}).unknown(true)
    .options({ abortEarly: false });