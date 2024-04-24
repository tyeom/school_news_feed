import _, { endsWith } from 'lodash';
import APIError from '~/helpers/apiError';
import newsService from '~/services/newsService';
import httpStatus from 'http-status';

// 소식 생성
export const createNews = async (req, res) => {
    if(!req.user) {
        throw new APIError('소식 생성시 유저 정보는 필수 입니다.', httpStatus.UNAUTHORIZED);
    }

    // 생성한 유저 정보
    req.body.createId = req.user.id;

	const news = await newsService.createNews(req.body);
	return res.json({
		success: true,
		data: { news }
	});
};

// 소식 수정
export const updateNews = async (req, res) => {
	const news = await newsService.updateNews(req.params.newsId, req.user.id, req.body);

	return res.json({
		success: true,
		data: news
	});
};

// 소식 조회
export const getNews = async (req, res) => {
	const news = await newsService.getNews(req.params.newsId);
	return res.json({
		success: true,
		data: news
	});
};

// 학교별 소식 조회
export const getNewsBySchool = async (req, res) => {
	const filters = _.pick(req.query, ['q']);
	const options = _.pick(req.query, ['limit', 'page', 'sortBy', 'sortDirection']);
    const {results, totalResults} = await newsService.getNewsBySchool(filters, options);

    return res.json({
		success: true,
		data: results,
		pagination: {
			total: totalResults
		}
	});
};

// 소식 삭제
export const deleteNews = async (req, res) => {
    const foundNews = await newsService.deleteNews(req.params.newsId, req.user.id);
	return res.json({
		success: true,
		data: {}
	});
};

export default {
	createNews,
	updateNews,
    getNews,
	getNewsBySchool,
    deleteNews,
};
