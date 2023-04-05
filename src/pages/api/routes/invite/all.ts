import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const invites = await prisma.invites.findMany();

    return res.status(200).json({ message: `Invites fetched`, data: invites });


}

export default handler;