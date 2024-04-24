import { Router } from 'express';
import catchAsync from '~/helpers/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import schoolValidation from '~/validations/schoolValidation';
import schoolController from '~/controllers/schoolController';

const router = Router();

// 학교 CRUD EndPoint
router.get('/', authenticate('Administrator'), catchAsync(schoolController.getAllSchool));
router.get('/:schoolId', authenticate('Administrator'), catchAsync(schoolController.getSchool));
router.post('/create', authenticate('Administrator'), validate(schoolValidation.createSchool), catchAsync(schoolController.createSchool));
router.put('/:schoolId', authenticate('Administrator'), validate(schoolValidation.createSchool), catchAsync(schoolController.updateSchool));
router.delete('/:schoolId', authenticate('Administrator'), catchAsync(schoolController.deleteSchool));

export default router;