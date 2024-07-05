import express from "express";
import dotenv from "dotenv";
import profileRouter from "./routes/profile.route.js";
import productRouter from "./routes/products.route.js";
import authRouter from "./routes/auth.route.js";
import reviewRouter from "./routes/review.route.js";
import { prisma, redisClient } from "./utils/db.js";
dotenv.config();
import cors from 'cors';
import cookieParser from "cookie-parser";

prisma.$connect()
    .then(() => {
        console.log("Prisma connected successfully");
    })
    .catch((error) => {
        console.error("Prisma connection failed:", error);
    });

await redisClient.connect()
    .then(() => {
        console.log("Redis connected successfully");
    })
    .catch((error) => {
        console.error("Redis connection failed:", error);
    });

const PORT = process.env.PORT || 5000;



const app = express();

app.use(cookieParser());
app.use(express.json());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use("/api/v1/users", profileRouter);
app.use('/api/v1/products', productRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use((err, res) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.use(cors({ origin: ["http://localhost:5000"], methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
