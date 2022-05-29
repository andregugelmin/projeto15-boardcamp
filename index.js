import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import categoriesRouter from './Routers/categoriesRouter.js';
import gamesRouter from './Routers/gamesRouter.js';
import customersRouter from './Routers/customersRouter.js';

const app = express();
app.use(cors());
app.use(json());

app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter);

app.listen(4000, () => {
    console.log(chalk.bold.green('Server running on port 4000'));
});
