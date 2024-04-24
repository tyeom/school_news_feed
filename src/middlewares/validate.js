import Joi from 'joi';
import _ from 'lodash';

const validate = (schema) => (req, res, next) => {
	const validSchema = _.pick(schema, ['params', 'query', 'body']);
    // 요청된 데이터에서 해당 모델 속성 key 추출
	const object = _.pick(req, Object.keys(validSchema));
    // 해당 모델 속성 값 유효성 체크
	const { error, value } = Joi.compile(validSchema)
		.prefs({ errors: { label: 'path', wrap: { label: false } }, abortEarly: false })
		.validate(object);
	if (error) {
		return next(error);
	}
	Object.assign(req, value);
	return next();
};

export default validate;
