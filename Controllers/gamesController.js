import chalk from 'chalk';
import db from './../db.js';

export async function getGames(req, res) {
    const { name } = req.query;
    try {
        const result = !name
            ? await db.query(
                  `SELECT games.*, 
                  categories.id as "categoryId", 
                  categories.name as "categoryName" 
                  FROM games 
                  JOIN categories 
                  ON games."categoryId" = categories.id;`
              )
            : await db.query(
                  `SELECT games.*, 
                  categories.id as "categoryId", 
                  categories.name as "categoryName" 
                  FROM games 
                  JOIN categories 
                  ON games."categoryId" = categories.id 
                  WHERE games.name LIKE $1%;`,
                  [name.toLowerCase()]
              );
        res.send(result.rows);
    } catch (e) {
        res.sendStatus(500);
        console.error(chalk.bold.red('Could not get games'), e);
    }
}

export async function postGame(req, res) {
    const newGame = res.locals.game;
    try {
        const result = await db.query(
            `
        INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5);
        `,
            [
                newGame.name,
                newGame.image,
                newGame.stockTotal,
                newGame.categoryId,
                newGame.pricePerDay,
            ]
        );
    } catch (e) {}
    return res.sendStatus(201);
}
