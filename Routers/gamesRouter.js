import { Router } from 'express';
import { getGames, postGame } from '../Controllers/gamesController.js';
import {
    checkCategoryIdExists,
    checkGameExists,
    joiValidationGame,
} from '../Middlewares/gamesMiddleware.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post(
    '/games',
    joiValidationGame,
    checkCategoryIdExists,
    checkGameExists,
    postGame
);
export default gamesRouter;
