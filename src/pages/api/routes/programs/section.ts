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
                const { type, content, link, programId } = req.body as {
                    type: string;
                    content?: string;
                    link?: string;
                    programId: string;
                };


                if (!type || !programId || !(content || link)) return res.status(400).json({ message: `Missing fields.` });

                // create ProgramSection
                const programSection = await prisma.programSection.create({
                    data: {
                        type,
                        content,
                        link,
                        programId
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
                const { id, content, link } = req.body as {
                    id: string;
                    content?: string;
                    link?: string;
                };

                if (!id || !(content || link)) return res.status(400).json({ message: `Missing fields.` });

                const programSection = await prisma.programSection.update({
                    where: {
                        id
                    },
                    data: {
                        content,
                        link
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

        default:
            return res
                .status(405)
                .json({ message: `Method ${req.method} not allowed.` });
    }
};

export default handler;
