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
                  WHERE LOWER(games.name) LIKE '${name.toLowerCase()}%';`
              );
        return res.send(result.rows);
    } catch (e) {
        console.error(chalk.bold.red('Could not get games'), e);
        return res.sendStatus(500);
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
    } catch (e) {
        console.error(chalk.bold.red('Could not post game'), e);
        return res.sendStatus(500);
    }
    return res.sendStatus(201);
}
