import APIError from '~/helpers/apiError';
import tokenService from '~/services/tokenService';
import User from '~/models/userModel';
import httpStatus from 'http-status';
import Token from '~/models/tokenModel';
import Role from '~/models/roleModel';

// 회원가입 [학생]
export const signup = async (body) => {
	const role = await Role.getRoleByName('Student');
	body.roles = [role.id];
	const user = await User.createUser(body);
	return user;
};

// 로그인
export const signin = async (userName, password) => {
	const user = await User.getUserByUserName(userName);
	if (!user || !(await user.isPasswordMatch(password))) {
		throw new APIError('잘못된 아이디 또는 패스워드', httpStatus.BAD_REQUEST);
	}
	const tokens = await tokenService.generateAuthTokens(user);
	return { user, tokens };
};

// 로그아웃
export const signout = async (token) => {
	await Token.removeToken(token);
};

// 아이디 체크
export const verifyUserName = async (userName) => {
	const verifyUserName = await User.isUserNameAlreadyExists(userName);
	return !verifyUserName;
};

// 이메일 체크
export const verifyEmail = async (email) => {
	const verifyEmail = await User.isEmailAlreadyExists(email);
	return !verifyEmail;
};

// 회원 정보 수정
export const updateMe = async (id, body) => {
	const user = await User.updateUserById(id, body);
	return user;
};

export default {
	signup,
	signin,
	signout,
    verifyUserName,
	verifyEmail,
    updateMe,
};
