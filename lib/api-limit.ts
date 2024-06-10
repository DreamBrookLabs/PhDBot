import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    try {
        //console.log('Prisma Client:', prismadb);  // Log the prisma client

        const userApiLimit = await prismadb.UserApiLimit.findUnique({
            where: {
                userId: userId
            }
        });

        if (userApiLimit) {
            await prismadb.UserApiLimit.update({
                where: { userId: userId },
                data: { count: userApiLimit.count + 1 },
            });
        } else {
            await prismadb.UserApiLimit.create({
                data: { userId: userId, count: 1 }
            });
        }
    } catch (error) {
        console.error('Error increasing API limit:', error);
        throw new Error('Failed to increase API limit');
    }
};

export const checkApiLimit = async () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    try {
        console.log('Prisma Client:', prismadb);  // Log the prisma client

        const userApiLimit = await prismadb.UserApiLimit.findUnique({
            where: {
                userId: userId
            }
        });

        if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking API limit:', error);
        throw new Error('Failed to check API limit');
    }
};


export const getApiLimitCount = async () => {
    const { userId } = auth();

    if (!userId) {
        return 0
    }
    
    const userApiLimit = await prismadb.UserApiLimit.findUnique({
        where: {
            userId
        }
    });

    if (!userApiLimit) {
        return 0
    }

    return userApiLimit.count;
}