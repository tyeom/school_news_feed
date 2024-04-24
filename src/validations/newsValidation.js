import Joi from 'joi';

// 학교 소식 생성/수정 유효성 설정
export const createNews = {
	body: Joi.object().keys({
        school: Joi.string().required(),
		title: Joi.string().trim().min(2).max(50).required(),
		content: Joi.string().trim().required(),
	})
};

export default {
	createNews
};