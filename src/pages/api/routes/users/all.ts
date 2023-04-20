import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const users = await prisma.user.findMany(
        {
            orderBy: {
                createdAt: "desc",
            },

        }
    );

    return res.status(200).json({ message: `Users fetched.`, data: users });


}

export default handler;