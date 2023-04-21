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

    // enroll a talent to a program
    // receive: programId, talentId, organizationId

    // validations: 1) programId exists, 2) talentId exists, 3) talent is not already enrolled in program

    const { programId, talentId, organizationId } = req.body as { programId: string, talentId: string; organizationId: string };

    const program = await prisma.onboardingProgram.findUnique({
        where: {
            id: programId,
        },
    });

    if (!program) return res.status(400).json({ error: "Program not found" });

    const talent = await prisma.user.findUnique({
        where: {
            id: talentId,
        },
    });

    if (!talent) return res.status(400).json({ error: "Talent not found" });

    // create enrollment
    const enrollment = await prisma.onboardingProgramTalents.create({
        data: {
            programId: programId,
            userId: talentId,
            organizationId: organizationId,
        },
    });

    return res.status(200).json({ message: `Talent enrolled!`, data: enrollment });

}

export default handler;