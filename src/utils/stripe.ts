import { RequestHandler } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, );

export const validateCard: RequestHandler = async (req, res, next) => {
    const { paymentMethodId } = req.body;

    try {
      // Crea un PaymentIntent de pequeña cantidad, en modo de confirmación manual y sin captura.
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 50,
        currency: "usd",
        payment_method: paymentMethodId,
        confirmation_method: "manual",
        confirm: true,
        capture_method: "manual",
        return_url: "http://localhost:3000/verify-complete" // Agrega este parámetro
      });
  
      // Si la autorización fue exitosa, cancelamos el PaymentIntent para evitar el cargo real.
      await stripe.paymentIntents.cancel(paymentIntent.id);
  
      res.json({ verified: true });
    } catch (error: any) {
      console.error("Error verificando la tarjeta:", error);
      res.status(500).json({ verified: false, error: error.message });
    }
};