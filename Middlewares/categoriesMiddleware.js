import joi from 'joi';
import { stripHtml } from 'string-strip-html';
import db from '../db.js';
import chalk from 'chalk';

export async function joiValidationCategory(req, res, next) {
    const categoryName = stripHtml(req.body.name).result.trim();
    const userSchema = joi.object({
        categoryName: joi.string().required(),
    });

    const validation = userSchema.validate(
        { categoryName },
        { abortEarly: false }
    );

    if (validation.error) {
        res.status(400).send({
            message: 'Invalid category name',
            details: validation.error.details.map((e) => e.message),
        });
        return;
    }

    res.locals.category = {
        name: categoryName,
    };

    next();
}

export async function checkCategoryExists(req, res, next) {
    const newCategorie = res.locals.category;
    try {
        const result = await db.query(
            `SELECT * FROM categories WHERE name='${newCategorie.name}'`
        );
        if (result.rows.length > 0) {
            res.status(409).send({
                message: 'Invalid category name',
                details: 'Category name already exists',
            });
            return;
        }
    } catch (e) {
        return res.sendStatus(500);
    }

    next();
}
