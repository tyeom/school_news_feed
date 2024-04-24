import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

const env = process.env;

// 기본 환경 변수 값 초기화
export default {
    // express 설정
	APP_NAME: env.APP_NAME,
	HOST: env.HOST,
	PORT: env.PORT,

    // mongoDB 설정
	DATABASE_URI: env.DATABASE_URI,
	DATABASE_OPTIONS: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},

    // JWT Token
	JWT_ACCESS_TOKEN_SECRET: env.JWT_ACCESS_TOKEN_SECRET,
	JWT_ACCESS_TOKEN_EXPIRATION_MINUTES: env.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES,
};
