import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id as string;

    const invite = await prisma.invites.findUnique({
        where: {
            id,
        },
    });

    return res.status(200).json({ message: `Invite fetched.`, data: invite });

}

export default handler;