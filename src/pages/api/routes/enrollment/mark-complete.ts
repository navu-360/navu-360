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

    // mark an enrollment as complete
    // receive: enrollmentId

    // validations: 1) enrollmentId exists, 2) enrollment is not already complete

    const { enrollmentId } = req.body as { enrollmentId: string };

    const enrollment = await prisma.onboardingProgramTalents.findUnique({
        where: {
            id: enrollmentId,
        },
    });

    if (!enrollment) return res.status(400).json({ error: "Enrollment not found" });

    if (enrollment.enrollmentStatus === "completed") return res.status(400).json({ error: "Enrollment already complete" });

    // update enrollment
    const updatedEnrollment = await prisma.onboardingProgramTalents.update({
        where: {
            id: enrollmentId,
        },
        data: {
            enrollmentStatus: "completed",
        },
    });

    return res.status(200).json({ message: `Enrollment marked complete!`, data: updatedEnrollment });

}

export default handler;