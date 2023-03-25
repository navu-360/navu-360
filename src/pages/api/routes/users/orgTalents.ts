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

    const users = await prisma.onboardingProgramTalents.findMany({
        where: {
            organizationId: orgId,
        },
    });

    //

    return res.status(200).json({ message: `Users found.`, data: users });

}

export default handler;