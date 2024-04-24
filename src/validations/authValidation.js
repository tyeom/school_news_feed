import Joi from 'joi';

// 회원 가입 유효성 설정
export const signup = {
	body: Joi.object().keys({
		firstName: Joi.string().trim().min(2).max(20).required(),
		lastName: Joi.string().trim().min(2).max(20).required(),
		userName: Joi.string().alphanum().min(4).max(20).required(),
		email: Joi.string().email().required(),
		password: Joi.string().trim().min(3).max(50).required()
	})
};

// 로그인 유효성 설정
export const signin = {
	body: Joi.object().keys({
		userName: Joi.string().required(),
		password: Joi.string().required()
	})
};

// 회원 수정 유효성 설정
export const updateMe = {
	body: Joi.object().keys({
		firstName: Joi.string().trim().min(2).max(20).required(),
		lastName: Joi.string().trim().min(2).max(20).required(),
		email: Joi.string().email().required(),
		password: Joi.string().trim().min(3).max(50).required()
	})
};

export default {
	signup,
	signin,
    updateMe
};