import { Router } from 'express';
import catchAsync from '~/helpers/catchAsync';
import authenticate from '~/middlewares/authenticate';
import testController from '~/controllers/testController';

const router = Router();

router.get('/server-time', catchAsync(testController.serverTime));
router.get('/auth-server-time', authenticate('Student'), catchAsync(testController.authServerTime));
router.get('/auth2-server-time', authenticate('Administrator'), catchAsync(testController.authServerTime));
router.get('/auth3-server-time', authenticate('Administrator', 'Student'), catchAsync(testController.authServerTime));

export default router;