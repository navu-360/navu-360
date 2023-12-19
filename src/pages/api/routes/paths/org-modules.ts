/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }
    switch (req.method) {
        // get all learning paths for an organization
        case "GET":
            try {
                const organization = await prisma.organization.findFirst({
                    where: {
                        userId: session?.user?.id as string,
                    },
                    select: {
                        id: true,
                    }
                });

                if (!organization) {
                    return res.status(400).json({ message: `Organization not found.` });
                }

                const learningPaths = await prisma.learningPath.findMany({
                    where: {
                        orgId: organization.id,
                    },
                });

                return res.status(200).json({ message: `Learning paths fetched.`, data: learningPaths });
            } catch (error: any) {
                return res.status(500).json({ message: error.message });
            }

        default:
            return res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }
}


export default handler;