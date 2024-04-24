import { Router } from 'express';
import catchAsync from '~/helpers/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import newsValidation from '~/validations/newsValidation';
import newsController from '~/controllers/newsController';

const router = Router();

router.get('/', authenticate('Administrator'), catchAsync(newsController.getNewsBySchool));
router.get('/:newsId', authenticate('Administrator'), catchAsync(newsController.getNews));
router.post('/create', authenticate('Administrator'), validate(newsValidation.createNews), catchAsync(newsController.createNews));
router.put('/:newsId', authenticate('Administrator'), validate(newsValidation.createNews), catchAsync(newsController.updateNews));
router.delete('/:newsId', authenticate('Administrator'), catchAsync(newsController.deleteNews));

export default router;