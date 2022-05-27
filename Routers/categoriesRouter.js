import { Router } from 'express';
import {
    checkCategoryExists,
    joiValidationCategory,
} from '../Middlewares/categoriesMiddleware.js';

import {
    getCategories,
    postCategory,
} from './../Controllers/categoriesController.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post(
    '/categories',
    joiValidationCategory,
    checkCategoryExists,
    postCategory
);

export default categoriesRouter;
