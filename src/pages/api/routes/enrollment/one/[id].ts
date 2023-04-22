import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // get one enrollment by id
    const id = req.query.id as string;
    const enrollment = await prisma.onboardingProgramTalents.findUnique({
        where: {
            id,
        },
        include: {
            OnboardingProgram: true,
        },
    });

    return res.status(200).json({ message: `Enrollment found!`, data: enrollment });

}

export default handler;