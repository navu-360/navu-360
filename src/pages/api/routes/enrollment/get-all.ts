import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // get all enrollments
    const enrollments = await prisma.onboardingProgramTalents.findMany({
        select: {
            id: true,
            programId: true,
        }
    });

    return res.status(200).json({ message: `All enrollments found!`, data: enrollments });

}

export default handler;