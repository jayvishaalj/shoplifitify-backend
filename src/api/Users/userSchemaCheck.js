const Joi = require('@hapi/joi');

module.exports.userRegisterSchema = Joi.object({
    display_name: Joi.string().required(),
    phno: Joi.number().integer().min(1000000000).max(9999999999).required(),
    email_id: Joi.string().min(6).required().email(),
    dob: Joi.string().required(),
    gender: Joi.string().valid('male').valid('female').valid('other').required(),
    shop_name: Joi.string().required(),
    store_description: Joi.string().required(),
    password: Joi.string().required(),
    password_repeat: Joi.string().required().valid(Joi.ref('password')).messages({
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
