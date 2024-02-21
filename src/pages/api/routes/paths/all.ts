import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const paths = await prisma.learningPath.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true
            }
        });

        return res
            .status(200)
            .json({ message: `Paths fetched.`, data: paths });
    } catch (error) {
        return res
            .status(500)
            // @ts-ignore
            .json({ message: error.message });
    }
};

export default handler;
