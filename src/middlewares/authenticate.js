import passport from 'passport';
import httpStatus from 'http-status';
import APIError from '~/helpers/apiError';
import Role from '~/models/roleModel';

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
	if (err || info || !user) {
		return reject(new APIError(httpStatus[httpStatus.UNAUTHORIZED], httpStatus.UNAUTHORIZED));
	}

	req.user = user;

    // 특정 권한 체크
	if (requiredRights.length) {
		const roles = await Role.find({ $and: [ {enabled: true}, {_id: { $in: user.roles }} ] });
		const hasRequiredRights = roles.some( p => requiredRights.includes(p.name) );
		
        console.log('requiredRights: ', requiredRights);
        console.log('userRoles: ', roles);
        console.log('requiredRights: ', requiredRights);

		if (!hasRequiredRights) {
			return reject(new APIError('Resource access denied', httpStatus.FORBIDDEN));
		}
	}
	return resolve();
};

const authenticate =
	(...requiredRights) =>
	async (req, res, next) => {
		return new Promise((resolve, reject) => {
			passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
		})
        .then(() => next())
        .catch((err) => next(err));
	};

export default authenticate;
