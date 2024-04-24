export const serverTime = async (req, res) => {
	return res.json({
		success: true,
		data: `${new Date().toLocaleString()}`
	});
};

export const authServerTime = async (req, res) => {
	return res.json({
		success: true,
		data: `인증 필요 : ${new Date().toLocaleString()}`
	});
};

export default {
	serverTime,
    authServerTime
};
