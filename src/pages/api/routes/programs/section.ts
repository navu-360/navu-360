import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /*
      API endpoint to 1) add a program section
      */

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    switch (req.method) {
        case "POST":
            try {
                // type, content, link, programId
                const { type, content, link, programId, name } = req.body as {
                    type: string;
                    content?: string;
                    link?: string;
                    programId?: string;
                    name: string;
                };

                const organization = await prisma.organization.findFirst({
                    where: {
                        userId: session?.user?.id as string,
                    },
                    select: {
                        id: true,
                    }
                });

                if (!organization) return res.status(404).json({ message: `Organization not found.` });


                if (!type || !(content || link) || !name) return res.status(400).json({ message: `Missing fields.` });

                // create ProgramSection
                const programSection = await prisma.programSection.create({
                    data: {
                        type,
                        content,
                        link,
                        programId,
                        name,
                        orgId: organization.id
                    },
                });


                return res
                    .status(200)
                    .json({ message: `Program section added!`, data: programSection });
            } catch (error) {
                return res
                    .status(500)
                    // @ts-ignore
                    .json({ message: error.message });
            }

        case "PATCH":
            // edit a program section given id and new content
            try {
                const { id, content, link, name, programId } = req.body as {
                    id: string;
                    content?: string;
                    link?: string;
                    name?: string;
                    programId?: string;
                };

                if (!id) return res.status(400).json({ message: `Missing fields.` });

                const programSection = await prisma.programSection.update({
                    where: {
                        id
                    },
                    data: {
                        content,
                        link,
                        name,
                        programId
                    }
                });

                return res
                    .status(200)
                    .json({ message: `Program section updated!`, data: programSection });
            } catch (error) {
                return res
                    .status(500)
                    // @ts-ignore
                    .json({ message: error.message });
            }

        case "DELETE":
            // delete a program section given id
            try {
                const { id } = req.body as {
                    id: string;
                };

                if (!id) return res.status(400).json({ message: `Missing fields.` });

                const programSection = await prisma.programSection.delete({
                    where: {
                        id
                    }
                });

                return res
                    .status(200)
                    .json({ message: `Program section deleted!`, data: programSection });
            } catch (error) {
                return res
                    .status(500)
                    // @ts-ignore
                    .json({ message: error.message });
            }
        case "GET":
            // get the organization sections which do not have a programId - library sections, get using field orgId

            const organization = await prisma.organization.findFirst({
                where: {
                    userId: session?.user?.id as string,
                },
                select: {
                    id: true,
                }
            });

            if (!organization) return res.status(404).json({ message: `Organization not found.` });

            const sections = await prisma.programSection.findMany({
                where: {
                    orgId: organization.id,
                    programId: null
                },
                orderBy: {
                    createdAt: "desc"
                },
                cacheStrategy: {
                    ttl: 60,
                    swr: 10,
                },
            });

            return res
                .status(200)
                .json({ message: `Sections fetched.`, data: sections });
        default:
            return res
                .status(405)
                .json({ message: `Method ${req.method} not allowed.` });
    }
};

export default handler;
