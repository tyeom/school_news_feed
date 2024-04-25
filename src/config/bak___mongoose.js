import mongoose from 'mongoose';
import config from './config';
import logger from './logger';

const mongooseConnect = () => {
	const reconnectTimeout = 5000;

	const connect = () => {
		mongoose.connect(config.DATABASE_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	};

	mongoose.Promise = global.Promise;

	const db = mongoose.connection;

	db.on('connecting', () => {
		logger.info('Connecting to MongoDB...');
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

	db.on('disconnected', () => {
		logger.error(`MongoDB disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`);
        // 5s 후 다시 연결
		setTimeout(() => connect(), reconnectTimeout);
	});

	connect();
};

export default mongooseConnect;
