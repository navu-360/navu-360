import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "../../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /*
      Remove talent from organization
      */

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }
    try {
        const id = req.query.id as string;

        const talent = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!talent) return res.status(400).json({ error: "Talent not found" });

        // delete talent
        const deletedTalent = await prisma.user.delete({
            where: {
                id,
            },
        });

        return res
            .status(200)
            .json({ message: `Talent removed!`, data: deletedTalent });


    } catch (error) {
        return res
            .status(500)
            // @ts-ignore
            .json({ message: error.message });
    }
};

export default handler;
