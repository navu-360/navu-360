import type { NextApiRequest, NextApiResponse } from "next";

import {
    getServerSession,
} from "next-auth";

import { prisma } from "../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /*
    API endpoint to 1) create a new organization. POST request
    */

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    switch (req.method) {
        case "POST":

            // fields to receive from request body: name, industry, noOfEmployees, createdBy
            const { name, industry, noOfEmployees, userId } = req.body as {
                name: string;
                industry: string;
                noOfEmployees: number;
                userId: string;
            };

            // validate request
            if (!name || !industry || !noOfEmployees || !userId) {
                res.status(400).json({ message: `Missing required fields.` });
                return;
            }

            // create organization
            const organization = await prisma.organization.create({
                data: {
                    name: name,
                    industry: industry,
                    noOfEmployees: noOfEmployees,
                    userId: userId,
                },
            });


            return res.status(201).json({ message: `Organization ${organization.name} created.`, data: organization });

        case "GET":

            const organizations = await prisma.organization.findMany();

            return res.status(200).json({ message: `Organizations retrieved.`, data: organizations });


        case "PATCH":


        default:
            res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }


}

export default handler;