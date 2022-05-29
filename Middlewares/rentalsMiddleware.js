import joi from 'joi';
import { stripHtml } from 'string-strip-html';
import dayjs from 'dayjs';

import db from '../db.js';

export async function joiValidationRental(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;
    const userSchema = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().min(1).required(),
    });

    const validation = userSchema.validate(
        { customerId, gameId, daysRented },
        { abortEarly: false }
    );

    if (validation.error) {
        res.status(400).send({
            message: 'Invalid rental input',
            details: validation.error.details.map((e) => e.message),
        });
        return;
    }

    next();
}

export async function checkRentalDetails(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;

    const rentDate = dayjs().format('YYYY-MM-DD');
    const gameInfo = await db.query(`SELECT * FROM games WHERE id = $1`, [
        gameId,
    ]);

    if (gameInfo.rows.length === 0) {
        res.status(400).send({
            message: 'Invalid game id',
            details: 'Game id not found on database',
        });
        return;
    }

    const gameRentals = await db.query(
        `SELECT * FROM rentals WHERE "gameId" = $1`,
        [gameId]
    );

    if (gameRentals.rows.length >= gameInfo.rows[0].stockTotal) {
        res.status(400).send({
            message: 'No game available',
            details: 'There are no game available on stock for rental',
        });
        return;
    }

    const customerInfo = await db.query(
        `SELECT * FROM customers WHERE id = $1`,
        [customerId]
    );

    if (customerInfo.rows.length === 0) {
        res.status(400).send({
            message: 'Invalid customer id',
            details: 'Customer id not found on database',
        });
        return;
    }

    const originalPrice = gameInfo.rows[0].pricePerDay * daysRented;

    res.locals.rental = {
        customerId,
        gameId,
        daysRented,
        rentDate,
        originalPrice,
        returnDate: null,
        delayFee: null,
    };

    next();
}

export async function checkRentalFinalization(req, res, next) {
    const id = req.params.id;

    const result = await db.query(
        `SELECT * FROM rentals WHERE rentals.id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        res.status(404).send({
            message: 'Invalid rental id',
            details: 'Rental id not found on database',
        });
        return;
    }

    if (result.rows[0].returnDate !== null) {
        res.status(400).send({
            message: 'Invalid rental',
            details: 'Rental already returned',
        });
        return;
    }

    next();
}
