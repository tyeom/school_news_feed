import moment from 'moment';
import config from '~/config/config';
import APIError from '~/helpers/apiError';
import Token from '~/models/tokenModel';
import httpStatus from 'http-status';
import jwtService from './jwtService';

export const verifyToken = async (token, type) => {
	const tokenDoc = await Token.findOne({ token, type, blacklisted: false });
	if (!tokenDoc) {
		throw new APIError('Token not found', httpStatus.UNAUTHORIZED);
	}
	if (moment(tokenDoc.expiresAt).format() < moment().format()) {
		throw new APIError('Token expires', httpStatus.UNAUTHORIZED);
	}
	return tokenDoc;
};

export const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(config.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES, 'minutes');  // 8시간 [이 프로젝트에선 리프래시 토큰은 사용하지 않음]
	const accessToken = await jwtService.sign(user.id, accessTokenExpires, config.JWT_ACCESS_TOKEN_SECRET, {
		algorithm: 'HS256'
	});

    /// 추후 리프래시 토큰 사용시 리프래시 토큰 발급 처리에 있어
    /// 해당 유저의 액세스 토큰 체크 용도로 DB에 보관
	await Token.saveToken(accessToken, user.id, accessTokenExpires.format());

	return {
		accessToken: {
			token: accessToken,
			expires: accessTokenExpires.format()
		},
	
	};
};

export const removeToken = async (token) => {
    await Token.removeToken(token);
}

export default {
	verifyToken,
	generateAuthTokens,
    removeToken
};
