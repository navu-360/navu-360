import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "auth/db";

import * as Sentry from "@sentry/nextjs";

import { getServerSession } from "next-auth";
import { authOptions } from 'auth/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }
    if (req.method === "GET") {
        try {
            // get a learningPath by id
            const { moduleId } = req.query as {
                moduleId: string;
            };

            const learningPath = await prisma.learningPath.findUnique({
                where: {
                    id: moduleId,
                },
                include: {
                    moduleCourse: {
                        include: {
                            course: {
                                include: {
                                    onboardingProgramTalents: {
                                        include: {
                                            User: {
                                                select: {
                                                    name: true,
                                                    email: true,
                                                    id: true,
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        },
                    },
                },
            });

            return res.status(200).json({ message: `Success.`, data: learningPath });

        } catch (error) {
            Sentry.captureException(error);
            console.log(error);
            return res
                .status(500)
                // @ts-ignore
                .json({ message: error.message });
        }
    }
    res.status(405).json({ message: `Method ${req.method} not allowed.` });
};

export default handler;
