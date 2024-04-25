import mongoose from 'mongoose';
import config from '~/config/config';
import app from './app';
import initialData from './config/initialData';
import logger from './config/logger';

let server;

// Mongoose DB
const db = mongoose.connection;

db.on('connecting', () => {
	logger.info('Connecting to MongoDB ..');
});

db.on('error', (err) => {
	logger.error(`MongoDB connection error: ${err}`);
	mongoose.disconnect();
});

db.on('connected', () => {
	logger.info('Connected to MongoDB!');
});

db.once('open', () => {
	logger.info('MongoDB connection opened!');
});

db.on('reconnected', () => {
	logger.info('MongoDB reconnected!');
});

// Mongoose DB 접속
const connect = async () => {
	try {
		await mongoose.connect(config.DATABASE_URI, config.DATABASE_OPTIONS);
		logger.info('MongoDB 접속 완료');
		await initialData();
		logger.info('MongoDB 데이터 초기화');

        // Express server
		server = app.listen(config.PORT, config.HOST, () => {
			logger.info(`Host: http://${config.HOST}:${config.PORT}`);
		});
	} catch (err) {
		logger.error(`MongoDB connection error: ${err}`);
	}
};

connect();

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.warn('Server closed');
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (err) => {
	logger.error(err);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// node.js App 프로세스 종료시
process.on('SIGTERM', () => {
	logger.info('SIGTERM received');
	if (server) {
		server.close();
	}
});

// 통합 테스트에서 supertest 패키지 사용 용도
export const serverClose = () => {
    server.close();
};

// 통합 테스트에서 supertest 패키지 사용 용도
exports.server = app;
exports.serverClose = serverClose;