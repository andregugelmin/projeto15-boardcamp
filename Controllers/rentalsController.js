import chalk from 'chalk';
import dayjs from 'dayjs';

import db from '../db.js';

export async function getRentals(req, res) {
    try {
        const result = await db.query(`
        SELECT rentals.*, games.name, games.image, games."categoryId", customers.name as "customerName", categories.name as "categoryName"
        FROM rentals 
        JOIN customers 
            ON rentals."customerId"  = customers.id 
        JOIN games 
            ON rentals."gameId" = games.id
        JOIN categories
        ON categories.id = games."categoryId";
        `);

        const rentalsObj = result.rows.map((rental) => {
            return {
                id: rental.id,
                customerId: rental.customerId,
                gameId: rental.gameId,
                rentDate: rental.rentDate,
                daysRented: rental.daysRented,
                returnDate: rental.returnDate,
                originalPrice: rental.originalPrice,
                delayFee: rental.delayFee,
                customer: {
                    id: rental.customerId,
                    name: rental.customerName,
                },
                game: {
                    id: rental.gameId,
                    name: rental.name,
                    categoryId: rental.gameId,
                    categoryName: rental.categoryName,
                },
            };
        });

        return res.send(rentalsObj);
    } catch (e) {
        console.error(chalk.bold.red('Could not get rentals'), e);
        return res.sendStatus(500);
    }
}

export async function postRental(req, res) {
    const newRental = res.locals.rental;

    try {
        const result = await db.query(
            `
        INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
            [
                newRental.customerId,
                newRental.gameId,
                newRental.daysRented,
                newRental.rentDate,
                newRental.originalPrice,
                newRental.returnDate,
                newRental.delayFee,
            ]
        );
    } catch (e) {
        console.error(chalk.bold.red('Could not post rental'), e);
        return res.sendStatus(500);
    }

    return res.sendStatus(201);
}

export async function returnRental(req, res) {
    const id = req.params.id;

    const returnDate = dayjs().format('YYYY-MM-DD');
    let delayFee = 0;

    try {
        const rentalDetails = await db.query(
            `SELECT rentals.*, games."pricePerDay" 
            FROM rentals 
            JOIN games 
                ON rentals."gameId" = games.id 
            WHERE rentals.id = $1`,
            [id]
        );

        const rentDate = dayjs(rentalDetails.rows[0].rentDate);
        const dateDif = rentDate.diff(returnDate, 'day');

        if (dateDif > rentalDetails.rows[0].daysRented) {
            delayFee =
                (dateDif - rentalDetails.rows[0].daysRented) *
                rentalDetails.rows[0].pricePerDay;
        }

        const updateRental = await db.query(
            `UPDATE rentals SET ("returnDate", "delayFee") = ( $1, $2 ) WHERE id = $3;`,
            [returnDate, delayFee, id]
        );
    } catch (e) {
        console.error(chalk.bold.red('Could not end rental'), e);
        return res.sendStatus(500);
    }

    return res.sendStatus(200);
}

export async function deleteRental(req, res) {
    const id = req.params.id;

    try {
        const rentalDelete = await db.query(
            `DELETE FROM rentals WHERE rentals.id = $1`,
            [id]
        );
    } catch (e) {
        console.error(chalk.bold.red('Could not delete rental'), e);
        return res.sendStatus(500);
    }

    return res.sendStatus(200);
}
