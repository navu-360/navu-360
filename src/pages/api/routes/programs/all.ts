import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const programs = await prisma.onboardingProgram.findMany(
        {
            orderBy: {
                createdAt: "desc",
            },

        }
    );

    return res.status(200).json({ message: `Programs fetched.`, data: programs });


}

export default handler;