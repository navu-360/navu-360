import type { NextApiRequest, NextApiResponse } from "next";

import {
    getServerSession,
} from "next-auth";

import { prisma } from "../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    switch (req.method) {
        case "GET":
            const id = req.query.id as string;
            const user = await prisma.user.findFirst(
                {
                    where: {
                        id: id,
                    }
                }
            );
            return res.status(200).json({ message: `User found.`, data: user });

        default:
            res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }


}

export default handler;