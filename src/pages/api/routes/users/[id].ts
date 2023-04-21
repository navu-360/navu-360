import type { NextApiRequest, NextApiResponse } from "next";


import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /*
       Get a user by id
       */
    switch (req.method) {
        case "GET":
            const id = req.query.id as string;
            const user = await prisma.user.findFirst(
                {
                    where: {
                        id: id,
                    }
                }
            );
            return res.status(200).json({ message: `User found.`, data: user });

        default:
            res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }


}

export default handler;