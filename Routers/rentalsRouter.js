import { Router } from 'express';
import {
    deleteRental,
    getRentals,
    postRental,
    returnRental,
} from '../Controllers/rentalsController.js';
import {
    checkRentalDetails,
    checkRentalFinalization,
    joiValidationRental,
} from '../Middlewares/rentalsMiddleware.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post(
    '/rentals',
    joiValidationRental,
    checkRentalDetails,
    postRental
);

rentalsRouter.post(
    '/rentals/:id/return',
    checkRentalFinalization,
    returnRental
);

rentalsRouter.delete('/rentals/:id', checkRentalFinalization, deleteRental);

export default rentalsRouter;
