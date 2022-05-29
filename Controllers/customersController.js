import chalk from 'chalk';
import db from '../db.js';

export async function getCustomers(req, res) {
    const { cpf } = req.query;
    try {
        const result = !cpf
            ? await db.query(`SELECT * FROM customers`)
            : await db.query(
                  `SELECT * FROM customers
                WHERE customers.cpf LIKE '${cpf}%';`
              );

        return res.send(result.rows);
    } catch (e) {
        console.error(chalk.bold.red('Could not get customers'), e);
        return res.sendStatus(500);
    }
}

export async function getCustomerByID(req, res) {
    const id = req.params.id;

    try {
        const result = await db.query(
            `SELECT * FROM customers
                WHERE customers.id = ${id};`
        );
        if (result.rows.length > 0) return res.send(result.rows[0]);
        else return res.send('Client not found').status(404);
    } catch (e) {
        res.sendStatus(500);
        console.error(chalk.bold.red('Could not get customer ' + id), e);
    }
}

export async function postCustomer(req, res) {
    const newCustomer = res.locals.customer;
    console.log({ newCustomer });
    try {
        const result = await db.query(
            `
        INSERT INTO customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4);
        `,
            [
                newCustomer.name,
                newCustomer.phone,
                newCustomer.cpf,
                newCustomer.birthday,
            ]
        );
    } catch (e) {
        console.error(chalk.bold.red('Could not post costumer'), e);
        return res.sendStatus(500);
    }

    return res.sendStatus(201);
}

export async function updateCustomer(req, res) {
    const customerInfos = res.locals.customer;
    const id = req.params.id;

    try {
        const result = await db.query(
            `UPDATE customers SET (name, phone, cpf, birthday) = ( $1, $2, $3, $4) WHERE id = $5;`,
            [
                customerInfos.name,
                customerInfos.phone,
                customerInfos.cpf,
                customerInfos.birthday,
                id,
            ]
        );
    } catch (e) {}
    return res.sendStatus(201);
}
