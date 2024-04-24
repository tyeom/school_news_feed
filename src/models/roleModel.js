import mongoose from 'mongoose';
import toJSON from '~/mongoPlugin/toJSONPlugin';
import APIError from '~/helpers/apiError';

// 권한에 따른 역할 모델
const roleSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true
		},
        enabled: {
			type: Boolean,
			default: true
		},
		description: {
			type: String,
			default: ''
		},
	},
	{
		timestamps: true
	}
);

roleSchema.plugin(toJSON);

// 역할 관리 [조회 / 생성 / 삭제]
class RoleClass {
	static async isNameAlreadyExists(name, excludeUserId) {
		return !!(await this.findOne({ name: name, _id: { $ne: excludeUserId } }));
	}

	static async getRoleByName(name) {
		return await this.findOne({ name: name });
	}

	static async getRoleById(id) {
		return await this.findById(id);
	}

	static async createRole(body) {
		if (await this.isNameAlreadyExists(body.name)) {
			throw new APIError('이미 등록된 역할', httpStatus.BAD_REQUEST);
		}
		
		return await this.create(body);
	}

    static async updateRoleById(roleId, body) {
		const role = await this.getRoleById(roleId);
		if (!role) {
			throw new APIError('역할을 찾을 수 없음', httpStatus.NOT_FOUND);
		}

        if (await this.isNameAlreadyExists(body.name, roleId)) {
			throw new APIError('이미 등록된 역할 이름', httpStatus.BAD_REQUEST);
		}
		
		Object.assign(role, body);
		return await role.save();
	}

	static async deleteRoleById(roleId) {
		const role = await this.getRoleById(roleId);
		if (!role) {
			throw new APIError('역할을 찾을 수 없음', httpStatus.NOT_FOUND);
		}
		return await role.deleteOne();
	}
}

roleSchema.loadClass(RoleClass);

const Role = mongoose.model('roles', roleSchema);

export default Role;