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

    // unenroll a talent from a program

    // receive: programId, talentId, enrollmentId

    // validations: 1) programId exists, 2) talentId exists, 3) talent is enrolled in program

    const { programId, talentId, enrollmentId } = req.body as { programId: string, talentId: string; enrollmentId: string };

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

    const talentEnrollment = await prisma.onboardingProgramTalents.findUnique({
        where: {
            id: enrollmentId
        },
    });

    if (!talentEnrollment) return res.status(400).json({ error: "Talent not enrolled in program" });

    // delete enrollment
    const enrollment = await prisma.onboardingProgramTalents.delete({
        where: {
            id: enrollmentId
        },
    });

    return res.status(200).json({ message: `Talent unenrolled!`, data: enrollment });

}

export default handler;