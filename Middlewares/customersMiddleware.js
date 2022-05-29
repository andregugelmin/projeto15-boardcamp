import joi from 'joi';
import { stripHtml } from 'string-strip-html';
import DateExtension from '@joi/date';

import db from '../db.js';

const Joi = joi.extend(DateExtension);

export async function joiValidationCustomer(req, res, next) {
    let { name, phone, cpf, birthday } = req.body;
    name = stripHtml(name).result.trim();

    const customerSchema = joi.object({
        name: joi.string().required(),
        phone: joi
            .string()
            .pattern(/^[0-9]{10,11}$/)
            .required(),
        cpf: joi
            .string()
            .pattern(/^[0-9]{11,11}$/)
            .required(),
        birthday: Joi.date().format('YYYY-MM-DD').required(),
    });

    const validation = customerSchema.validate(
        { name, phone, cpf, birthday },
        { abortEarly: false }
    );

    if (validation.error) {
        res.status(400).send({
            message: 'Invalid customer input',
            details: validation.error.details.map((e) => e.message),
        });
        console.log(validation.error.details.map((e) => e.message));
        return;
    }

    res.locals.customer = {
        name: name,
        phone: phone,
        cpf: cpf,
        birthday: birthday,
    };

    next();
}

export async function checkCustomerCPFExists(req, res, next) {
    const customerInfos = res.locals.customer;
    let id = -1;
    if (req.params.id) id = req.params.id;

    try {
        const result = await db.query(
            `SELECT * FROM customers WHERE cpf = $1 and id != $2`,
            [customerInfos.cpf, id]
        );
        if (result.rows.length > 0) {
            res.status(400).send({
                message: 'Invalid customer CPF',
                details: 'Customer CPF already exists',
            });
            return;
        }
    } catch (e) {
        return res.sendStatus(500);
    }

    next();
}
