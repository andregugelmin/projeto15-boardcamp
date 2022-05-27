import chalk from 'chalk';
import db from './../db.js';

export async function getCategories(req, res) {
    try {
        const result = await db.query('SELECT * FROM categories;');
        res.send(result.rows);
    } catch (e) {
        res.sendStatus(500);
        console.error(chalk.bold.red('Could not get categories'), e);
    }
}

export async function postCategory(req, res) {
    const newCategorie = res.locals.category;
    console.log(chalk.bold.yellow('Posting Category'));
    try {
        const result = await db.query(
            `
        INSERT INTO categories (name)
        VALUES ($1);
        `,
            [newCategorie.name]
        );
        res.sendStatus(201);
    } catch (e) {
        res.sendStatus(500);
        console.error(chalk.bold.red('Could not post category'), e);
    }
}
