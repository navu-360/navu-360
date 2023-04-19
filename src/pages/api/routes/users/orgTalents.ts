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

    const { orgId } = req.query as { orgId: string };

    // find all users with role of talent and orgId
    const users = await prisma.user.findMany({
        where: {
            orgId: orgId,
            role: "talent",
        },
    });

    return res.status(200).json({ message: `Users found.`, data: users });

}

export default handler;