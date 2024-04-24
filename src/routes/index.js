import { Router } from 'express';
import testRoute from './testRoute'
import authRoute from './authRoute';
import schoolRoute from './schoolRoute';
import newsRoute from './newsRoute';
import studentRoute from './studentRoute';

const router = Router();

router.use('/docs', testRoute);
router.use('/test', testRoute);
router.use('/auth', authRoute);
router.use('/school', schoolRoute);
router.use('/news', newsRoute);
router.use('/student', studentRoute);

export default router;
