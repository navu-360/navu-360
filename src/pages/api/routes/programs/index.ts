import type { NextApiRequest, NextApiResponse } from "next";

import {
    getServerSession,
} from "next-auth";

import { prisma } from "../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /*
    API endpoint to 1) create a new program. POST request
    */

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    switch (req.method) {
        case "POST":
            // name, content, organizationId
            const { name, content, organizationId } = req.body as {
                name: string;
                content: string;
                organizationId: string;
            };

            const program = await prisma.onboardingProgram.create({
                data: {
                    name,
                    content,
                    organization: {
                        connect: {
                            id: organizationId,
                        },
                    },
                },
            });

            return res.status(200).json({ message: `Program created.`, data: program });


        case "GET":

            const { orgId } = req.query as { orgId: string };
            const programs = await prisma.onboardingProgram.findMany(
                {
                    where: {
                        organizationId: orgId,
                    },

                }
            );

            return res.status(200).json({ message: `Programs fetched.`, data: programs });


        case "PATCH":


        default:
            return res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }


}

export default handler;