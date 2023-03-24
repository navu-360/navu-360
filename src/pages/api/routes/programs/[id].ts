import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id as string;

    const program = await prisma.onboardingProgram.findUnique({
        where: {
            id,
        },
    });

    return res.status(200).json({ message: `Program fetched.`, data: program });

}

export default handler;