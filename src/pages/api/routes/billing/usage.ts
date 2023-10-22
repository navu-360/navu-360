import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from 'auth/auth';
import { prisma } from 'auth/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    // get org for current user
    const organization = await prisma.organization.findFirst({
        where: {
            userId: session.user.id,
        },
        select: {
            id: true,
        }
    });
    if (!organization) {
        res.status(400).json({ message: `Organization not found.` });
        return;
    }
    // get a count of users who talentOrgId is equal to the current user's org id
    const allTalents = await prisma.user.findMany({
        where: {
            talentOrgId: organization.id,
            hasBeenOnboarded: true
        },
        select: {
            id: true,
        }
    });

    return res.status(200).json({ message: `Talent count fetched`, data: allTalents.length });
};

export default handler;
