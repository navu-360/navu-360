import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id as string;

    if (req.method === "GET") {
        const program = await prisma.onboardingProgram.findUnique({
            where: {
                id,
            },
        });

        return res.status(200).json({ message: `Program fetched.`, data: program });
    }

    if (req.method === "DELETE") {
        const program = await prisma.onboardingProgram.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({ message: `Program deleted.`, data: program });
    }

    if (req.method === "PUT") {
        const { name, content, organizationId } = req.body as {
            name: string;
            content: string;
            organizationId: string;
        };

        const program = await prisma.onboardingProgram.update({
            where: {
                id,
            },
            data: {
                name,
                content,
                organizationId,
            },
        });

        return res.status(200).json({ message: `Program updated.`, data: program });
    }

    res.status(405).json({ message: `Method ${req.method} not allowed.` });


}

export default handler;