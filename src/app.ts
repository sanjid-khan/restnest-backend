import express, { Application, Request,Response} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { propertyRoutes,landlordRoutes } from "./modules/property/property.route";
import { rentalRequestRoutes,landlordRentalRequestRoutes } from "./modules/Rental_Request/rentalRequest.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";
import { adminRoutes } from "./modules/admin/admin.route";



const app : Application = express();


app.use(cors({
    origin : config.app_url,
    credentials :true,
}))


// stripe webhook
app.use(
  "/api/payments/confirm",
  express.raw({ type: "application/json" })
);


app.use(express.json());
app.use(express.urlencoded( { extended : true}));
app.use(cookieParser())

app.get("/",(req : Request, res : Response)=>{
    res.send("Hello World!");
})


app.use("/api/user",userRoutes)
app.use("/api/auth",authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/landlord", landlordRoutes);
app.use("/api/rentals", rentalRequestRoutes);
app.use("/api/landlord/requests", landlordRentalRequestRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);



app.use(notFound);
app.use(globalErrorHandler);

export default app;