import _, { endsWith } from 'lodash';
import APIError from '~/helpers/apiError';
import schoolService from '~/services/schoolService';
import httpStatus from 'http-status';

// 학교 생성
export const createSchool = async (req, res) => {
    if(!req.user) {
        throw new APIError('학교 생성시 유저 정보는 필수 입니다.', httpStatus.UNAUTHORIZED);
    }

    // 생성한 유저 정보
    req.body.createId = req.user.id;

	const school = await schoolService.createSchool(req.body);
	return res.json({
		success: true,
		data: { school }
	});
};

// 학교 수정
export const updateSchool = async (req, res) => {
	const school = await schoolService.updateSchool(req.params.schoolId, req.user.id, req.body);

	return res.json({
		success: true,
		data: school
	});
};

// 학교 조회
export const getSchool = async (req, res) => {
	const school = await schoolService.getSchool(req.params.schoolId);
	return res.json({
		success: true,
		data: school
	});
};

// 학교 조회
export const getAllSchool = async (req, res) => {
	const filters = _.pick(req.query, ['q']);
	const options = _.pick(req.query, ['limit', 'page', 'sortBy', 'sortDirection']);
    const {results, totalResults} = await schoolService.getAllSchool(filters, options);

    return res.json({
		success: true,
		data: results,
		pagination: {
			total: totalResults
		}
	});
};

// 학교 삭제
export const deleteSchool = async (req, res) => {
    const foundSchool = await schoolService.deleteSchool(req.params.schoolId, req.user.id);
	return res.json({
		success: true,
		data: {}
	});
};

export default {
	createSchool,
	updateSchool,
    getSchool,
	getAllSchool,
    deleteSchool,
};
