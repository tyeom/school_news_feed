import APIError from '~/helpers/apiError';
import School from '~/models/schoolModel';
import httpStatus from 'http-status';

// 학교 생성
export const createSchool = async (body) => {
	const school = await School.createSchool(body);
	return school;
};

// 학교 수정
export const updateSchool = async (schoolId, id, body) => {
	const school = await School.updateSchoolById(schoolId, id, body);

	return school;
};

// 학교 조회
export const getSchool = async (schoolId) => {
	const school = await School.getSchoolById(schoolId);
	if (!school) {
		throw new APIError('학교를 찾을 수 없음', httpStatus.NOT_FOUND);
	}
	return school;
};

// 학교 조회
export const getAllSchool = async (filters, options) => {
    const schools = await School.paginate(
		options,
		null,
		filters.q && {
			$or: [
				{
					region: {
						$regex: filters.q,
						$options: 'i'
					}
				},
				{
					schoolName: {
						$regex: filters.q,
						$options: 'i'
					}
				}
			]
		}
	);

    return {
        results: schools.results,
        totalResults: schools.totalResults
    };
};

// 학교 삭제
export const deleteSchool = async (schoolId, userId) => {
    const foundSchool = await School.getSchoolByIdAndUserId(schoolId, userId);
	if (!foundSchool) {
		throw new APIError('학교를 찾을 수 없음', httpStatus.BAD_REQUEST);
	}
	await School.deleteSchoolById(schoolId, userId);
};

export default {
	createSchool,
	updateSchool,
    getSchool,
	getAllSchool,
    deleteSchool,
};
