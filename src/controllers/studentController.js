import APIError from '~/helpers/apiError';
import studentService from '~/services/studentService';
import httpStatus from 'http-status';

// 학교 구독
export const subscribe = async (req, res) => {
    if(!req.user) {
        throw new APIError('구독시 유저 정보는 필수 입니다.', httpStatus.UNAUTHORIZED);
    }

	const subscribe = await studentService.subscribe(req.user.id, req.body.schoolId);
	return res.json({
		success: true,
		data: { subscribe }
	});
};

// 학교 구독 취소
export const unSubscribe = async (req, res) => {
    if(!req.user) {
        throw new APIError('구독 취소시 유저 정보는 필수 입니다.', httpStatus.UNAUTHORIZED);
    }

	const unSubscribe = await studentService.unSubscribe(req.user.id, req.body.schoolId);
	return res.json({
		success: true,
		data: { unSubscribe }
	});
};

// 구독 학교 조회 [학교 소식 포함]
export const subscribeSchool = async (req, res) => {
    if(!req.user) {
        throw new APIError('유저 정보가 없습니다!', httpStatus.UNAUTHORIZED);
    }

	const subscribeSchool = await studentService.getSubscribeSchool(req.user.id);
	return res.json({
		success: true,
		data: { subscribeSchool }
	});
};

// 구독 이력이 있는 학교별 소식 조회
export const getNews = async (req, res) => {
    if(!req.user) {
        throw new APIError('유저 정보가 없습니다!', httpStatus.UNAUTHORIZED);
    }

	const schoolNews = await studentService.getNews(req.params.schoolId, req.user.id);
	return res.json({
		success: true,
		data: { schoolNews }
	});
};

export default {
    subscribe,
	unSubscribe,
    subscribeSchool,
    getNews
};