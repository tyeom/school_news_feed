import moment from 'moment';
import APIError from '~/helpers/apiError';
import httpStatus from 'http-status';
import Subscriptions from '~/models/subscriptionsModel';
import School from '~/models/schoolModel';
import News from '~/models/newsModel';

// 학교 구독
export const subscribe = async (userId, schoolId) => {
	const subscribe = await Subscriptions.subscribe(userId, schoolId);
	return subscribe;
};

// 학교 구독 취소
export const unSubscribe = async (userId, schoolId) => {
	const unSubscribe = await Subscriptions.unSubscribe(userId, schoolId);
	return unSubscribe;
};

// 구독 학교 조회 [학교 소식 포함]
export const getSubscribeSchool = async (userId) => {
    // 구독 정보
	const subscriptions = await Subscriptions.getSubscriptionsByUserId(userId);
    if(!subscriptions)
        throw new APIError('구독 정보 없음', httpStatus.BAD_REQUEST);

    // 구독중인 학교Id
    const subscribeSchoolIdArr =
        subscriptions.school.filter( p => p.subscribe === true);

    if(subscribeSchoolIdArr.length <= 0)
        throw new APIError('구독중인 학교 없음', httpStatus.BAD_REQUEST);

    const subscribeSchools = await School.find( {_id: { $in: subscribeSchoolIdArr.map(p => p.schoolId) }} );
	return subscribeSchools;
};

/// 구독 이력이 있는 학교별 소식 조회
/// 구독중 : 구독 시점 이후 소식 조회
/// 구독 취소 : 구독 취소 전까지 모든 소식 조회
export const getNews = async (schoolId, userId) => {
    // 구독 정보
	const subscriptions = await Subscriptions.getSubscriptionsByUserId(userId);
    if(!subscriptions)
        throw new APIError('구독 정보 없음', httpStatus.BAD_REQUEST);

    // 학교 찾기
    const subscribeSchool =
        subscriptions.school.find( p => p.schoolId.toString() === schoolId);

    if(!subscribeSchool)
        throw new APIError('구독 이력이 없는 학교', httpStatus.BAD_REQUEST);

    // 구독 기간중의 해당 학교 소식
    const subscribeNews = [];
    // 해당 학교의 모든 구독 날짜 이력
    const subscribeHistory = subscribeSchool.subscribeHistory;

    for(const subscribeDate of subscribeHistory) {
        const schoolNews = await News.find( { $and: [ { createdAt: {$gte: subscribeDate.subscribeAt, $lt: subscribeDate.unSubscribeAt ?? moment().add(10, 'seconds')} },
                                                      { school: {$in: subscribeSchool.schoolId} } ] } )
                                     .sort( { "updatedAt": -1 } );
        if(schoolNews.length > 0)
            /// unshift : 기존 요소를 우측으로 이동시키기에 시간 복잡도 O(n)으로 데이터가 많은 경우 성능 저하로
            /// 추후 페이징으로 요청 할 수 있도록 개선하고 정렬은 프론드앤드 에서 처리 하도록 하는 것이 좋다.
            //subscribeNews.unshift(schoolNews);
            subscribeNews.push(schoolNews);

    }
    
    return subscribeNews;


    // // 구독 학교 소식
    // // 현재 구독중인 학교
    // if(subscribeSchool.subscribe) {
    //     // 모든 소식 조회
    //     //const schoolNews = await News.find( {school: {$in: subscribeSchool.schoolId} } ).sort( { "updatedAt": -1 } );

    //     // 구독 시점 이후 소식만 조회
    //     const schoolNews = await News.find( {$and: [
    //         { createdAt: {$gt: subscribeSchool.subscribeAt} },
    //         { school: {$in: subscribeSchool.schoolId} }
    //     ]} ).sort( { "updatedAt": -1 } );

    //     return schoolNews;
    // }
    // // 구독 취소한 학교 [구독 취소 전까지 모든 소식 조회]
    // else {
    //     const schoolNews = await News.find( { $and: [ { createdAt: {$gte: subscribeSchool.subscribeAt, $lt: subscribeSchool.unSubscribeAt} },
    //                                                   { school: {$in: subscribeSchool.schoolId} } ] } )
    //                                  .sort( { "updatedAt": -1 } );
    //     return schoolNews;
    // }
};

export default {
    subscribe,
	unSubscribe,
    getSubscribeSchool,
    getNews
};