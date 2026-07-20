// import { Prisma } from "../../../generated/prisma/client";
// import Stripe from "stripe";
// import { PaymentStatus } from "../../../generated/prisma/enums";
// import { prisma } from "../../lib/prisma";
// import { stripe } from "../../lib/stripe";

// export const getPeriodEnd = (payload: Stripe.Subscription) => {
//   const currentPeriodEndInMilliseconds =
//     payload.items.data[0]?.current_period_end!;

//   return new Date(currentPeriodEndInMilliseconds * 1000);
// };


// // export const handleCheckoutCompleted = async (
// //   session: Stripe.Checkout.Session
// // ) => {
// //   const tenantId = session.metadata?.tenantId;
// //   const rentalRequestId = session.metadata?.rentalRequestId;

// //   const stripeCustomerId = session.customer as string;
// //   const stripeSubscriptionId = session.subscription as string;

// //   if (
// //     !tenantId ||
// //     !rentalRequestId ||
// //     !stripeCustomerId ||
// //     !stripeSubscriptionId
// //   ) {
// //     console.log("Webhook : Missing values");
// //     return;
// //   }

  
// //   const stripeSubscription = await stripe.subscriptions.retrieve(
// //     stripeSubscriptionId
// //   );

// //   const totalAmount = (session.amount_total || 0) / 100;

// //   await prisma.payment.create({
// //     data: {
// //       rentalRequestId,
// //       tenantId,

// //       amount: new Prisma.Decimal(totalAmount),

// //       transactionId: stripeSubscriptionId,

// //       stripeCustomerId,
// //       stripeSubscriptionId,

// //       status: PaymentStatus.COMPLETED,

// //       paidAt: new Date(),
// //     },
// //   });
// // };



// export const handleCheckoutCompleted = async (
//   session: Stripe.Checkout.Session
// ) => {
//   const tenantId = session.metadata?.tenantId;
//   const rentalRequestId = session.metadata?.rentalRequestId;

//   const stripeCustomerId = session.customer as string;
//   const stripeSubscriptionId = session.subscription as string;

//   if (
//     !tenantId ||
//     !rentalRequestId ||
//     !stripeCustomerId ||
//     !stripeSubscriptionId
//   ) {
//     console.log("Webhook: Missing values");
//     return;
//   }

//   const stripeSubscription = await stripe.subscriptions.retrieve(
//     stripeSubscriptionId
//   );

//   const totalAmount =
//     (session.amount_total ??
//       stripeSubscription.items.data[0]?.price.unit_amount ??
//       0) / 100;

//   await prisma.payment.create({
//     data: {
//       rentalRequestId,
//       tenantId,

//       amount: new Prisma.Decimal(totalAmount),

//       currency: session.currency?.toUpperCase() ?? "USD",

//       transactionId: stripeSubscriptionId,

//       stripeCustomerId,
//       stripeSubscriptionId,

//       status: PaymentStatus.COMPLETED,

//       paidAt: new Date(),
//     },
//   });
// };




// export const handleChangeSubscription = async (
//   payload: Stripe.Subscription
// ) => {
//   const stripeSubscriptionId = payload.id;

//   const payment = await prisma.payment.findFirst({
//     where: {
//       stripeSubscriptionId,
//     },
//   });

//   if (!payment) {
//     console.log(
//       `Webhook : No Payment found for subscription id : ${stripeSubscriptionId}`
//     );
//     return;
//   }

//   const status =
//     payload.status === "active" || payload.status === "trialing"
//       ? PaymentStatus.COMPLETED
//       : PaymentStatus.FAILED;

//   await prisma.payment.update({
//     where: {
//       id: payment.id,
//     },
//     data: {
//       status,
//     },
//   });
// };









import { Prisma } from "../../../generated/prisma/client";
import Stripe from "stripe";
import { PaymentStatus, PropertyStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const tenantId = session.metadata?.tenantId;
  const rentalRequestId = session.metadata?.rentalRequestId;

  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (
    !tenantId ||
    !rentalRequestId ||
    !stripeCustomerId ||
    !stripeSubscriptionId
  ) {
    console.log("Webhook : Missing values");
    return;
  }

  const totalAmount = (session.amount_total ?? 0) / 100;

  await prisma.$transaction(async (tx) => {

    await tx.payment.create({
      data: {
        rentalRequestId,
        tenantId,

        amount: new Prisma.Decimal(totalAmount),
        currency: session.currency?.toUpperCase() ?? "BDT",
        transactionId: stripeSubscriptionId,

        stripeCustomerId,
        stripeSubscriptionId,

        status: PaymentStatus.COMPLETED,

        paidAt: new Date(),

      },
    });


    const rentalRequest = await tx.rentalRequest.findUniqueOrThrow({
      where: {
        id: rentalRequestId,
      },
      select: {
        propertyId: true,
      },
    });


    await tx.property.update({
      where: {
        id: rentalRequest.propertyId,
      },
      data: {
        status: PropertyStatus.RENTED,
      },
    });

  });
};



export const handleChangeSubscription = async (
  payload: Stripe.Subscription
) => {
  const stripeSubscriptionId = payload.id;

  const payment = await prisma.payment.findFirst({
    where: {
      stripeSubscriptionId,
    },
  });

  if (!payment) {
    console.log(
      `Webhook : No Payment found for subscription id : ${stripeSubscriptionId}`
    );
    return;
  }

  const status =
    payload.status === "active" || payload.status === "trialing"
      ? PaymentStatus.COMPLETED
      : PaymentStatus.FAILED;

  await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      status,
    },
  });
};
