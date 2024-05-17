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
});

const newGroupChatValidator = Joi.object().keys({
  name: Joi.string().required(),
  members: Joi.array().items(Joi.string()).min(2).max(10).required(),
});

const addMemberValidator = Joi.object().keys({
  chatId: Joi.string().required(),
  members: Joi.array().items(Joi.string()).min(1).max(10).required(),
});

const removeMemberValidator = Joi.object().keys({
  chatId: Joi.string().required(),
  userId: Joi.string().required(),
});

const leaveGroupValidator = Joi.object().keys({
  id: Joi.string().required(),
});

const sendAttachmentValidator = Joi.object().keys({
  chatId: Joi.string().required(),
  files: Joi.array().min(1).max(5).required()
});


const getMessageValidator = Joi.object().keys({
  id: Joi.string().required(),
});

export { registrationSchema, loginSchema, newGroupChatValidator, addMemberValidator, removeMemberValidator, leaveGroupValidator, sendAttachmentValidator, getMessageValidator }
