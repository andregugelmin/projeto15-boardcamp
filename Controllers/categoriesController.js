import chalk from 'chalk';
import db from './../db.js';

export async function getCategories(req, res) {
    try {
        const result = await db.query('SELECT * FROM categories;');
        return res.send(result.rows);
    } catch (e) {
        console.error(chalk.bold.red('Could not get categories'), e);
        return res.sendStatus(500);
    }
}

export async function postCategory(req, res) {
    const newCategorie = res.locals.category;
    try {
        const result = await db.query(
            `
        INSERT INTO categories (name)
        VALUES ($1);
        `,
            [newCategorie.name]
        );
        return res.sendStatus(201);
    } catch (e) {
        console.error(chalk.bold.red('Could not post category'), e);
        return res.sendStatus(500);
    }
}
