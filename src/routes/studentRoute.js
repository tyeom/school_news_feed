import { Router } from 'express';
import catchAsync from '~/helpers/catchAsync';
import authenticate from '~/middlewares/authenticate';
import studentController from '~/controllers/studentController';

const router = Router();

// 구독 EndPoint
router.post('/subscribe', authenticate('Administrator', 'Student'), catchAsync(studentController.subscribe));
router.post('/unsubscribe', authenticate('Administrator', 'Student'), catchAsync(studentController.unSubscribe));

// 구독 학교 조회 [학교 소식 포함]
router.get('/subscribe-school', authenticate('Administrator', 'Student'), catchAsync(studentController.subscribeSchool));
// 구독 이력이 있는 학교별 소식 조회
router.get('/news/:schoolId', authenticate('Administrator', 'Student'), catchAsync(studentController.getNews));

export default router;