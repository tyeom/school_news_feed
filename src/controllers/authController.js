import APIError from '~/helpers/apiError';
import userService from '~/services/userService';
import httpStatus from 'http-status';

// 회원가입 [학생]
export const signup = async (req, res) => {
    const newUser = await userService.signup(req.body);
	return res.json({
		success: true,
		data: { newUser }
	});
};

// 로그인
export const signin = async (req, res) => {
    const signInfo = await userService.signin(req.body.userName, req.body.password);
	return res.json({
		success: true,
		data: signInfo
	});
};

// 로그아웃
export const signout = async (req, res) => {
	await userService.removeToken(req.header('authorization'));
	return res.json({
		success: true,
		data: 'Signout success'
	});
};

// 아이디 체크
export const verifyUserName = async (req, res) => {
	try {
        const verifyUserName = await userService.verifyUserName(req.body.userName);
		
		return res.json({
			success: true,
			data: verifyUserName
		});
	} catch (err) {
		throw new APIError('User name verification failed', httpStatus[500]);
	}
};

// 이메일 체크
export const verifyEmail = async (req, res) => {
	try {
        const verifyEmail = await userService.verifyEmail(req.body.userEmail);
		
		return res.json({
			success: true,
			data: verifyEmail
		});
	} catch (err) {
		throw new APIError('Email verification failed', httpStatus[500]);
	}
};

// 회원 정보 수정
export const updateMe = async (req, res) => {
	const user = await userService.updateMe(req.user.id, req.body);
	return res.json({
		success: true,
		data: user
	});
};

export default {
	signup,
	signin,
	signout,
    verifyUserName,
	verifyEmail,
    updateMe
};
