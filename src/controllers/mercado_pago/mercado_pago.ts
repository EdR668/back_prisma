import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { MercadoPagoConfig, Preference, OAuth } from 'mercadopago';
import app from "../../app";

const prisma = new PrismaClient();

if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN is not defined");
}
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });

const oauth = new OAuth(client);

export const CreatePreference: RequestHandler = async (req, res, next) => {
    try {
        const {contractId, tenantId} = req.body;

        const contract = await prisma.contract.findUnique({
            where: {id: Number(contractId)},
            include: {property: {select: {address: true, city: true, state: true}}},
        });

        if (!contract) {
            throw createHttpError(404, "El contrato no existe");
        }

        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                items: [
                    {   
                        id: String(contract.id),
                        title: `Pago de renta de ${contract.property.address}, ${contract.property.city}, ${contract.property.state}`,
                        unit_price: contract.monthlyRent,
                        quantity: 1,
                    },
                ],
                marketplace: "Limitless Holdings",
                // back_urls: {
                //     success: `${process.env.FRONTEND_URL}/payment/success`,
                //     failure: `${process.env.FRONTEND_URL}/payment/failure`,
                //     pending: `${process.env.FRONTEND_URL}/payment/pending`,
                // },
                // auto_return: "approved",
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

        if (!code) {
            throw createHttpError(400, "El codigo no fue devuelto por Mercado Pago");
        }

        const data = await oauth.create({
            body: {
                client_secret: process.env.MP_CLIENT_SECRET,
                client_id: process.env.MP_CLIENT_ID,
                code: code as string,
                redirect_uri: `https://back-prisma-git-mercadopago-edr668s-projects.vercel.app/api/mercadopago/callback`,
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

    }
    catch (error) {
        next(error);
    }
}

