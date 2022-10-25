const Joi = require('@hapi/joi');

module.exports.userRegisterSchema = Joi.object({
    name: Joi.string().required(),
    phno: Joi.number().integer().min(1000000000).max(9999999999).required(),
    email: Joi.string().min(6).required().email(),
    dob: Joi.string().required(),
    gender: Joi.string().valid('male').valid('female').valid('other').required(),
    password: Joi.string().required(),
    passwordRepeat: Joi.string().required().valid(Joi.ref('password')).messages({
        'any.only': "Passwords Doesn't match !",
    }),
});

module.exports.userOTPVerificationSchema = Joi.object({
    user_id: Joi.string().required(),
    otp: Joi.number().required(),
});

module.exports.userLoginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().required(),
});

module.exports.userDetailsSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
});
