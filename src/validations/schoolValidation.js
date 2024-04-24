import Joi from 'joi';
import EducationLevel from '~/enums/educationLevel';

// 학교 생성/수정 유효성 설정
export const createSchool = {
	body: Joi.object().keys({
		region: Joi.string().required(),
		schoolName: Joi.string().required(),
        educationLevel: Joi.string().valid('elementary','middle','high'),
	})
};

export default {
	createSchool
};