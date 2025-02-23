import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { MercadoPagoConfig, Preference, OAuth } from 'mercadopago';
import app from "../../app";

const prisma = new PrismaClient();

export const CreatePreference: RequestHandler = async (req, res, next) => {
    try {
        const {contractId, tenantId} = req.body;

        const contract = await prisma.contract.findUnique({
            where: {id: Number(contractId)},
            include: {property: {select: {address: true, city: true, state: true, landlordAuthID: true}}},
        });

        if (!contract) {
            throw createHttpError(404, "El contrato no existe");
        }

        const landlord = await prisma.landlord.findUnique({
            where: { authID: contract.property.landlordAuthID },
            select: { mercadopagoaccesstoken: true, firstName: true, lastName: true },
        });

        if (!landlord) {
            throw createHttpError(404, "El arrendador no existe");
        }

        const tenant = await prisma.tenant.findUnique({
            where: { authID: tenantId },
            select: { email: true, firstName: true, lastName: true },
        });

        if (!tenant) {
            throw createHttpError(404, "El inquilino no existe");
        }

        if (!landlord.mercadopagoaccesstoken) {
            throw createHttpError(400, "El arrendador no tiene un token de acceso de Mercado Pago");
        }

        const client = new MercadoPagoConfig({ accessToken: landlord.mercadopagoaccesstoken });
        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                items: [
                    {   
                        id: String(contract.id),
                        title: `Pago de renta de ${contract.property.address}, ${contract.property.city}, ${contract.property.state}`,
                        unit_price: contract.monthlyRent,
                        quantity: 1,
                        currency_id: "COP",
                    },
                ],
                payer: {
                    email: tenant.email,
                    name: tenant.firstName,
                    surname: tenant.lastName,
                },
                marketplace: "Limitless Holdings",
                external_reference: String(contract.id),
                auto_return: "approved",
                back_urls: {
                    success: `http://localhost:3000/inquilino-dashboard/payment/success?contractId=${contract.id}`,
                    failure: `http://localhost:3000/inquilino-dashboard/payment/failed?contractId=${contract.id}`,
                    pending: `http://localhost:3000/inquilino-dashboard/payment/pending?contractId=${contract.id}`,
                },
            } 
        });

        res.status(201).json({
            message: "Preferencia de pago creada exitosamente",
            init_point: response.init_point,
        });
    }
    catch (error) {
        next(error);
    }
};

export const MercadoPagoCallback: RequestHandler  = async (req, res, next) => {
    try {
        const { code, state} = req.query;

        if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
            throw new Error("MERCADO_PAGO_ACCESS_TOKEN is not defined");
        }

        const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });

        const oauth = new OAuth(client);

        if (!code) {
            throw createHttpError(400, "El codigo no fue devuelto por Mercado Pago");
        }

        const landlord = await prisma.landlord.findUnique({
            where: { authID: state as string },
            select: { mercadopagoaccesstoken: true },
        });

        if (landlord && landlord.mercadopagoaccesstoken !== null) {
            return res.redirect(`http://localhost:3000/arrendador-dashboard/propiedades`);
        }

        const data = await oauth.create({
            body: {
                client_secret: process.env.MP_CLIENT_SECRET,
                client_id: process.env.MP_CLIENT_ID,
                code: code as string,
                redirect_uri: `https://back-prisma-git-mercadopago-edr668s-projects.vercel.app/api/mercado-pago/callback`,
            }
        });

        if (!data.access_token) {
            throw new Error("No access token received");
        }

        const { access_token, user_id } = data;
      
        await prisma.landlord.update({
        where: { authID: state as string },
        data: {
            mercadopagoaccesstoken: access_token,
        },
        });

        return res.redirect(`http://localhost:3000/arrendador-dashboard/propiedades`);
    }
    catch (error) {
        next(error);
        return res.redirect(`http://localhost:3000/error`);
    }
}

