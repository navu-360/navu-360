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
                res.status(200).json({ message: `Login success!`, data: userExists });
                return;
            }

            const user = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    image: image,
                },
            });

            res.status(200).json({ message: `User ${user.name} created.`, data: user });
            break;

        case "GET":
            const session = await getServerSession(req, res, authOptions);
            if (!session) {
                res.status(401).json({ message: `Unauthorized.` });
                return;
            }
            const users = await prisma.user.findMany();
            res.status(200).json({ message: `Users found.`, data: users });
            break;

        default:
            res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }


}

export default handler;