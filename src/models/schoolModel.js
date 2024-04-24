import EducationLevel from '~/enums/educationLevel';
import mongoose from 'mongoose';
import toJSON from '~/mongoPlugin/toJSONPlugin'
import paginate from '~/mongoPlugin/paginatePlugin';
import APIError from '~/helpers/apiError';
import httpStatus from 'http-status';

const schoolSchema = mongoose.Schema(
	{
		region: {
			type: String,
			required: true
		},
		schoolName: {
			type: String,
			required: true
		},
        educationLevel: {
            type: String,
            enum: Object.values(EducationLevel),
            required: false
        },
        createId: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true,
            ref: 'users'
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true }
	}
);

schoolSchema.plugin(toJSON);
schoolSchema.plugin(paginate);

// 학교 관리
class SchoolClass {
	static async isSchoolAlreadyExists(region, schoolName) {
        return !!await this.findOne({ $and: [ {region: region}, {schoolName: schoolName} ] });
	}

	static async getSchoolById(id) {
		return await this.findById(id);
	}

    static async getSchoolByIdAndUserId(schoolId, userId, excludeUserId) {
		return await this.findOne({ $and: [ {_id: schoolId}, {createId: userId} ], _id: { $ne: excludeUserId } });
	}

	static async getSchoolByName(region, schoolName) {
		return await this.findOne({ $and: [ {region: region}, {schoolName: schoolName} ] });
	}

	static async createSchool(body) {
		if (await this.isSchoolAlreadyExists(body.region, body.schoolName)) {
			throw new APIError('중복된 학교 이름', httpStatus.BAD_REQUEST);
		}

		return await this.create(body);
	}

	static async updateSchoolById(schoolId, excludeUserId, body) {
		const school = await this.getSchoolByIdAndUserId(schoolId, excludeUserId);
		if (!school) {
			throw new APIError('학교를 찾을 수 없음', httpStatus.NOT_FOUND);
		}
		if (await this.isSchoolAlreadyExists(body.region, body.schoolName, excludeUserId)) {
			throw new APIError('이미 등록된 학교 이름', httpStatus.BAD_REQUEST);
		}
		
		Object.assign(school, body);
		return await school.save();
	}

	static async deleteSchoolById(schoolId, excludeUserId) {
		const school = await this.getSchoolByIdAndUserId(schoolId, excludeUserId);
		if (!school) {
			throw new APIError('학교를 찾을 수 없음', httpStatus.NOT_FOUND);
		}
		return await school.deleteOne();
	}
}

schoolSchema.loadClass(SchoolClass);

const School = mongoose.model('school', schoolSchema);

export default School;