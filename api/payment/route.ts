import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export const POST = async (req: NextRequest) => {
    const headers = new Headers(req.headers);
    const origin = headers.get("origin");

    const {orderId, cartId} = await req.json();

    const order = await prisma.order.findUnique({
        where: { id: orderId}
    })

    const cart = await prisma.cart.findUnique({
        where: { id: cartId},
        include: {
            cartItems: {
                include: {
                    product: true
                }
            }
        }
    })

    if (!order || !cart) {
        return Response.json(null, {
            status: 404,
            statusText: "Not Found"
        })
    }

    const lineItems = cart.cartItems.map( (cartItem) => (
        {
            quantity: cartItem.amount,
            price_data: {
                currency: "usd",
                product_data: {
                    name: cartItem.product.name,
                    images: [cartItem.product.image]
                },
                unit_amount: cartItem.product.price * 100
            }
        }
    ))

    try {
        const session = await stripe.checkout.sessions.create({
            ui_mode: "embedded",
            metadata: {orderId, cartId},
            line_items: lineItems,
            mode: "payment",
            return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`
        })

        return Response.json({clientSecret: session.client_secret})
    }
    catch (error){
        console.log(error)
        return Response.json(null, {
            status: 500,
            statusText: "Internal Server Error"
        })
    }

};
