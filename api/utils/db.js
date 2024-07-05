import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

const prisma = new PrismaClient();

const redisClient = new createClient({
    url: process.env.REDIS_URL,
});

export { prisma, redisClient };