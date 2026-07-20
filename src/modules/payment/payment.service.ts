import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { RentalRequestStatus } from "../../../generated/prisma/enums";
import {
  handleCheckoutCompleted,
  handleChangeSubscription,
} from "./payment.utils";



const createPaymentSession = async (tenantId: string,rentalRequestId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {

    const rentalRequest = await tx.rentalRequest.findFirstOrThrow({
      where: {
        id: rentalRequestId,
        tenantId,
        status: RentalRequestStatus.APPROVED,
      },
      include: {
        property: true,
      },
    });

    const tenant = await tx.user.findFirstOrThrow({
      where: {
        id: tenantId,
      },
    });

    

    const existingPayment = await tx.payment.findFirst({
      where: {
        rentalRequestId,
      },
    });

    let stripeCustomerId = existingPayment?.stripeCustomerId;

    

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: tenant.email,
        name: tenant.name,
        metadata: {
          tenantId,
          rentalRequestId,
        },
      });

      stripeCustomerId = customer.id;
    }


    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price_id,
          quantity: 1,
        },
      ],

      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/payment?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,

      metadata: {
        tenantId,
        rentalRequestId,
      },
    });

    return session.url;

  });

  return {
    paymentUrl: transactionResult,
  };
};




const handleWebhook = async (payload: Buffer,signature: string) => {

  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret
  );

  switch (event.type) {

    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object 
      );
      break;

    case "customer.subscription.updated":
      await handleChangeSubscription(
        event.data.object 
      );
      break;

    case "customer.subscription.deleted":
      await handleChangeSubscription(
        event.data.object 
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }
};


const getPaymentHistory = async (tenantId: string) => {

  const payments = await prisma.payment.findMany({
    where: {
      tenantId,
    },

    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return payments;

};


const getSinglePayment = async (paymentId: string,tenantId: string) => {

  const payment = await prisma.payment.findFirstOrThrow({
    where: {
      id: paymentId,
      tenantId,
    },

    include: {
      tenant: {
        omit: {
          password: true,
        },
      },

      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
  });

  return payment;

};



export const paymentServices = {
  createPaymentSession,
  handleWebhook,
  getPaymentHistory,
  getSinglePayment,
};