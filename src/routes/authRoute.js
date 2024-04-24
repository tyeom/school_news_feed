import { Router } from 'express';
import catchAsync from '~/helpers/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import authValidation from '~/validations/authValidation';
import authController from '~/controllers/authController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /auth/signup:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/models/schemas/Book'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 *
 */
router.post('/signup', validate(authValidation.signup), catchAsync(authController.signup));
router.post('/signin', validate(authValidation.signin), catchAsync(authController.signin));
router.post('/signout', catchAsync(authController.signout));
router.post('/verify-username', catchAsync(authController.verifyUserName));
router.post('/verify-email', catchAsync(authController.verifyEmail));
router.put('/', authenticate(), validate(authValidation.updateMe), catchAsync(authController.updateMe));

export default router;