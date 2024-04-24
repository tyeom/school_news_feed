import mongoose from 'mongoose';
import toJSON from '~/mongoPlugin/toJSONPlugin'
import paginate from '~/mongoPlugin/paginatePlugin';
import APIError from '~/helpers/apiError';
import School from './schoolModel';
import httpStatus from 'http-status';

const newsSchema = mongoose.Schema(
	{
		createId: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true,
            ref: 'users'
		},
        title: {
			type: String,
			required: true
		},
		content: {
			type: String,
			required: true
		},
        school: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true,
            ref: 'school'
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true }
	}
);

newsSchema.plugin(toJSON);
newsSchema.plugin(paginate);

// 소식 관리
class NewsClass {
	static async getNewsById(id) {
		return await this.findById(id);
	}

    static async getNewsByIdAndUserId(newsId, userId, excludeUserId) {
		return await this.findOne({ $and: [ {_id: newsId}, {createId: userId} ], _id: { $ne: excludeUserId } });
	}

	static async createNews(body) {
        const school = await School.getSchoolById(body.school);
		if(!school)
			throw new APIError('존재 하지 않은 학교 정보', httpStatus.BAD_REQUEST);

        if(school.createId.toString() !== body.createId)
            throw new APIError('학교를 생성한 관리자만 소식을 등록할 수 있음', httpStatus.BAD_REQUEST);

		const news = await this.create(body);
        return news;
	}

	static async updateNewsById(newsId, excludeUserId, body) {
        const news = await this.getNewsByIdAndUserId(newsId, excludeUserId);
		if (!news) {
			throw new APIError('소식을 찾을 수 없음', httpStatus.NOT_FOUND);
		}
		
		Object.assign(news, body);
		return await news.save();
	}

	static async deleteNewsById(newsId, excludeUserId) {
		const news = await this.getNewsByIdAndUserId(newsId, excludeUserId);
		if (!news) {
			throw new APIError('소식을 찾을 수 없음', httpStatus.NOT_FOUND);
		}
		return await news.deleteOne();
	}
}

newsSchema.loadClass(NewsClass);

const News = mongoose.model('news', newsSchema);

export default News;