import APIError from '~/helpers/apiError';
import News from '~/models/newsModel';
import httpStatus from 'http-status';

// 소식 생성
export const createNews = async (body) => {
	const news = await News.createNews(body);
	return news;
};

// 소식 수정
export const updateNews = async (newsId, userId, body) => {
	const news = await News.updateNewsById(newsId, userId, body);
	return news;
};

// 소식 조회
export const getNews = async (newsId) => {
	const news = await News.getNewsById(newsId);
	if (!news) {
		throw new APIError('소식을 찾을 수 없음', httpStatus.NOT_FOUND);
	}
	return news;
};

// 학교별 소식 조회
export const getNewsBySchool = async (filters, options) => {
    const news = await News.paginate(
		options,
		null,
		filters.q && {
            school: filters.q,
		}
	);

    return {
        results: news.results,
        totalResults: news.totalResults
    };
};

// 소식 삭제
export const deleteNews = async (newsId, userId) => {
    const foundNews = await News.getNewsByIdAndUserId(newsId, userId);
	if (!foundNews) {
		throw new APIError('소식을 찾을 수 없음', httpStatus.BAD_REQUEST);
	}
	await News.deleteNewsById(newsId, userId);
};

export default {
	createNews,
	updateNews,
    getNews,
	getNewsBySchool,
    deleteNews,
};
