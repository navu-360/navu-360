import type { NextApiRequest, NextApiResponse } from "next";

import {
    getServerSession,
} from "next-auth";

import { prisma } from "../../../../../auth/db";
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

    const { programId } = req.query as { programId: string };

    const talents = await prisma.onboardingProgramTalents.findMany({
        where: {
            programId,
        },
    });

    return res.status(200).json({ message: `Talents found.`, data: talents });

}

export default handler;