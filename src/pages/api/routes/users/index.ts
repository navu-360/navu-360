import type { NextApiRequest, NextApiResponse } from "next";

import {
    getServerSession,
} from "next-auth";

import { prisma } from "../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /*
    API endpoint to 1) create a new user. POST request: name, email, image. 2) get all users. GET request.
    */

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    switch (req.method) {
        case "GET":
            // get only talents that belong to the organization
            const orgIdtalent = req.query.orgId as string;
            const users = await prisma.user.findMany({
                where: {
                    orgId: orgIdtalent,
                    role: "talent",
                }
                ,
                orderBy: {
                    name: "desc",
                }
            });
            return res.status(200).json({ message: `Users found.`, data: users });

        case "PATCH":
            // editable fields: image
            const { image: toEdit, publicId, position, role, hasBeenOnboarded, orgId } = req.body as {
                image: string;
                publicId: string;
                position: string;
                role: string;
                hasBeenOnboarded: boolean;
                orgId: string;
            };

            // validations
            // 1. A user can only belong to one organization. Check if the user already belongs to an organization.
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email,
                },
            });

            if (user?.orgId) {
                res.status(400).json({ message: `User ${user.name} already belongs to an organization.` });
                return;
            }



            const userToEdit = await prisma.user.update({
                where: {
                    email: session.user.email,
                },
                data: {
                    image: toEdit,
                    publicId: publicId,
                    position,
                    role,
                    hasBeenOnboarded,
                    orgId,
                },
            });

            res.status(200).json({ message: `User ${userToEdit.name} updated.`, data: userToEdit });

        default:
            res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }


}

export default handler;