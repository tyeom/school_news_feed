import mongoose from 'mongoose';
import toJSON from '~/mongoPlugin/toJSONPlugin'
import APIError from '~/helpers/apiError';
import httpStatus from 'http-status';
import moment from 'moment';
import School from './schoolModel';

const subscriptionsSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true,
            ref: 'users'
		},
		school: [
			{
				schoolId: {
					type: mongoose.SchemaTypes.ObjectId,
					required: true,
					ref: 'school'
				},
				subscribe: {
					type: Boolean,
					required: true,
				},
				// 구독한 날짜 [이 시점부터 학교 소식을 받아온다.]
				subscribeAt: {
					type: Date
				},
				// 구독 해지한 날짜 [해지 날짜가 있다면 이 시점 이후는 학교 소식을 받아오지 않는다.]
				unSubscribeAt: {
					type: Date
				}
			},
		],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true }
	}
);

subscriptionsSchema.plugin(toJSON);

// 구독 관리
class SubscriptionsClass {
	// 유저 아이디로 학교 소식 구독 정보 가져오기
	static async getSubscriptionsByUserId(userId) {
		return await this.findOne({user: userId});
	}

	// 학교 소식 구독
	static async subscribe(userId, schoolId) {
		const school = await School.getSchoolById(schoolId);
		if(!school)
			throw new APIError('존재 하지 않은 학교 정보', httpStatus.BAD_REQUEST);

		// 학생의 구독 정보
		const subscriptions = await this.getSubscriptionsByUserId(userId);
		if(!subscriptions) {
			const subscribeInfo = {
				"user": userId,
				"school": {
					"schoolId": schoolId,
					"subscribe": true,
					"subscribeAt": moment(),
					"unSubscribeAt": null
				}
			}
			const newSubscribe = await this.create(subscribeInfo);
			return newSubscribe;
		}
		else {
			// 학생 구독 리스트중 해당 학교
			const subscribeSchool = subscriptions.school.find( p => p.schoolId.toString() === schoolId);
			if (subscribeSchool) {
				if(subscribeSchool.subscribe) {
					throw new APIError('이미 구독중인 학교', httpStatus.BAD_REQUEST);
				}
				else {
					// 구독 취소 후 다시 구독 처리
					subscribeSchool.subscribe = true;
					subscribeSchool.subscribeAt = moment();
					subscribeSchool.unSubscribeAt = null;
				}
			}
			else {
				// 해당 학교 구독
				subscriptions.school.push(
					{
						"schoolId": schoolId,
						"subscribe": true,
						"subscribeAt": moment(),
						"unSubscribeAt": null
					}
				);
			}

			return await subscriptions.save();
		}
	}

	// 학교 소식 구독 취소
	static async unSubscribe(userId, schoolId) {
		// 학생의 구독 정보
		const subscriptions = await this.getSubscriptionsByUserId(userId);
		if(!subscriptions) {
			throw new APIError('구독 정보 없음', httpStatus.BAD_REQUEST);
		}
		else {
			// 학생 구독 리스트중 해당 학교
			const subscribeSchool = subscriptions.school.find( p => p.schoolId.toString() === schoolId);
			if (subscribeSchool) {
				if(subscribeSchool.subscribe) {
					subscribeSchool.subscribe = false;
					subscribeSchool.subscribeAt = null;
					subscribeSchool.unSubscribeAt = moment();
				}
				else {
					throw new APIError('해당 학교는 구독중 아님', httpStatus.BAD_REQUEST);
				}
			}

			return await subscriptions.save();
		}
	}
}

subscriptionsSchema.loadClass(SubscriptionsClass);

const Subscriptions = mongoose.model('subscriptions', subscriptionsSchema);

export default Subscriptions;