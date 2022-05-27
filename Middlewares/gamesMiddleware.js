import joi from 'joi';
import { stripHtml } from 'string-strip-html';
import db from '../db.js';
import chalk from 'chalk';

export async function joiValidationGame(req, res, next) {
    let { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    name = stripHtml(name).result.trim();

    const userSchema = joi.object({
        name: joi.string().required(),
        image: joi.string().uri().required(),
        stockTotal: joi.number().min(1).required(),
        categoryId: joi.number().required(),
        pricePerDay: joi.number().min(1).required(),
    });

    const validation = userSchema.validate(
        { name, image, stockTotal, categoryId, pricePerDay },
        { abortEarly: false }
    );

    if (validation.error) {
        res.status(400).send({
            message: 'Invalid game input',
            details: validation.error.details.map((e) => e.message),
        });
        return;
    }

    res.locals.game = {
        name: name,
        image: image,
        stockTotal: stockTotal,
        categoryId: categoryId,
        pricePerDay: pricePerDay,
    };

    next();
}

export async function checkCategoryIdExists(req, res, next) {
    const newGame = res.locals.game;
    try {
        const result = await db.query(
            `SELECT * FROM categories WHERE id = $1`,
            [newGame.categoryId]
        );
        if (result.rows.length === 0) {
            res.status(400).send({
                message: 'Invalid category id',
                details: 'Category Id not found on database',
            });
            return;
        }
    } catch (e) {
        return res.sendStatus(500);
    }

    next();
}

export async function checkGameExists(req, res, next) {
    const newGame = res.locals.game;
    try {
        const result = await db.query(`SELECT * FROM games WHERE name = $1`, [
            newGame.name,
        ]);
        if (result.rows.length > 0) {
            res.status(409).send({
                message: 'Invalid game name',
                details: 'Game name already exists on database',
            });
            return;
        }
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }

    next();
}
