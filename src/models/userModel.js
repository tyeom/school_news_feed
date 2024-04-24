import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import toJSON from '~/mongoPlugin/toJSONPlugin'
import APIError from '~/helpers/apiError';
import Role from './roleModel';
import httpStatus from 'http-status';

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		userName: {
			type: String,
			required: true,
			unique: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			private: true
		},
		roles: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'roles'
			}
		]
	},
	{
		timestamps: true,
		toJSON: { virtuals: true }
	}
);

userSchema.plugin(toJSON);

// 유저 관리
class UserClass {
	static async isUserNameAlreadyExists(userName, excludeUserId) {
		return !!(await this.findOne({ userName: userName, _id: { $ne: excludeUserId } }));
	}

	static async isEmailAlreadyExists(email, excludeUserId) {
		return !!(await this.findOne({ email: email, _id: { $ne: excludeUserId } }));
	}

	static async isRoleIdAlreadyExists(roleId, excludeUserId) {
		return !!(await this.findOne({ roles: roleId, _id: { $ne: excludeUserId } }));
	}

	static async getUserById(id) {
		return await this.findById(id);
	}

	static async getUserByUserName(userName) {
		return await this.findOne({ userName: userName });
	}

	static async getUserByEmail(email) {
		return await this.findOne({ email: email });
	}

	static async createUser(body) {
		if (await this.isUserNameAlreadyExists(body.userName)) {
			throw new APIError('중복된 유저 이름', httpStatus.BAD_REQUEST);
		}
		if (await this.isEmailAlreadyExists(body.email)) {
			throw new APIError('중복된 유저 이메일', httpStatus.BAD_REQUEST);
		}
		if (body.roles) {
			await Promise.all(
				body.roles.map(async (rid) => {
					if (!(await Role.findById(rid))) {
						throw new APIError('잘못된 권한 설정', httpStatus.BAD_REQUEST);
					}
				})
			);
		}
		return await this.create(body);
	}

	static async updateUserById(userId, body) {
		const user = await this.getUserById(userId);
		if (!user) {
			throw new APIError('유저를 찾을 수 없음', httpStatus.NOT_FOUND);
		}
		if (await this.isEmailAlreadyExists(body.email, userId)) {
			throw new APIError('이미 등록된 유저 이메일', httpStatus.BAD_REQUEST);
		}
		if (body.roles) {
			await Promise.all(
				body.roles.map(async (rid) => {
					if (!(await Role.findById(rid))) {
						throw new APIError('잘못된 권한 설정', httpStatus.BAD_REQUEST);
					}
				})
			);
		}
		Object.assign(user, body);
		return await user.save();
	}

	static async deleteUserById(userId) {
		const user = await this.getUserById(userId);
		if (!user) {
			throw new APIError('유저를 찾을 수 없음', httpStatus.NOT_FOUND);
		}
		return await user.deleteOne();
	}

	async isPasswordMatch(password) {
		return bcrypt.compareSync(password, this.password);
	}
}

userSchema.loadClass(UserClass);

// mongoDB save 메서드 호출 전 패스워드 encrypt 처리
userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		const passwordGenSalt = bcrypt.genSaltSync(10);
		this.password = bcrypt.hashSync(this.password, passwordGenSalt);
	}
	next();
});

const User = mongoose.model('users', userSchema);

export default User;