import type { NextApiRequest, NextApiResponse } from "next";

import {
    getServerSession,
} from "next-auth";

import { prisma } from "../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /*
    API endpoint to 1) create a new user. POST request: name, email, image. 2) get all users. GET request.
    */

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    const { orgId } = req.query as { orgId: string };

    const users = await prisma.user.findMany({
        where: {
            role: "talent",
        },
    });

    // 

    return res.status(200).json({ message: `Users found.`, data: users });

}

export default handler;