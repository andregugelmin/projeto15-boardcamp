import { Router } from 'express';
import {
    getCustomerByID,
    getCustomers,
    postCustomer,
    updateCustomer,
} from '../Controllers/customersController.js';
import {
    checkCustomerCPFExists,
    joiValidationCustomer,
} from '../Middlewares/customersMiddleware.js';

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomerByID);
customersRouter.post(
    '/customers',
    joiValidationCustomer,
    checkCustomerCPFExists,
    postCustomer
);
customersRouter.put(
    '/customers/:id',
    joiValidationCustomer,
    checkCustomerCPFExists,
    updateCustomer
);

export default customersRouter;
