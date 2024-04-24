import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '~/helpers/apiError';
import toJSON from '~/mongoPlugin/toJSONPlugin';

const tokenSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'users',
			required: true
		},
		token: {
			type: String,
			required: true,
			index: true
		},
		expiresAt: {
			type: Date,
			required: true
		}
	},
	{
		timestamps: true
	}
);

tokenSchema.plugin(toJSON);

class TokenClass {
	static async saveToken(token, userId, expires) {
		const tokenDoc = await this.create({
			user: userId,
			token,
			expiresAt: expires,
		});
		return tokenDoc;
	}

	static async removeToken(token) {
		const tokenDoc = await this.findOne({ token: token });
		if (!tokenDoc) {
			throw new APIError('Token not found', httpStatus.BAD_REQUEST);
		}
		await tokenDoc.deleteOne();
	}
}

tokenSchema.loadClass(TokenClass);

const Token = mongoose.model('tokens', tokenSchema);

export default Token;
