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
        case "POST":
            const { name, email, image } = req.body as {
                name: string;
                email: string;
                image: string;
            };

            // validate request
            if (!name || !email || !image) {
                res.status(400).json({ message: `Missing required fields.` });
                return;
            }

            // check if user already exists - email
            const userExists = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            // if user exists, it means they are login in with Google
            if (userExists) {
                res.status(200).json({ message: `Login success!`, data: userExists, isNew: false });
                return;
            }

            const user = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    image: image,
                },
            });

            res.status(201).json({ message: `User ${user.name} created.`, data: user, isNew: true });
            break;

        case "GET":

            const users = await prisma.user.findMany();
            return res.status(200).json({ message: `Users found.`, data: users });


        case "PATCH":
            // editable fields: image
            const { image: toEdit, publicId, position } = req.body as {
                image: string;
                publicId: string;
                position: string;
            };

            // validate request
            if (!position) {
                res.status(400).json({ message: `Missing required fields.` });
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
                },
            });

            res.status(200).json({ message: `User ${userToEdit.name} updated.`, data: userToEdit });

        default:
            res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }


}

export default handler;