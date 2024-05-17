import Joi from 'joi';

const registrationSchema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),

  avatar: Joi.array()

});

const loginSchema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})


export { registrationSchema, loginSchema }
