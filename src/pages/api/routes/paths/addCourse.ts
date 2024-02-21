import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    switch (req.method) {
        case "POST":
            try {
                // receive courseId and moduleId and then create a new LearningPathCourse
                const { courseIds, moduleId } = req.body as {
                    courseIds: string[];
                    moduleId: string;
                };

                if (!courseIds || !moduleId) {
                    return res.status(400).json({ message: `Missing fields.` });
                }

                const learningPathCourses = courseIds.map((courseId) => {
                    return {
                        moduleId: moduleId,
                        courseId,
                    };
                }
                );
                await Promise.all(
                    learningPathCourses.map(async (learningPathCourse) => {
                        await prisma.learningPathCourse.upsert({
                            where: {
                                moduleId_courseId: {
                                    moduleId: learningPathCourse.moduleId,
                                    courseId: learningPathCourse.courseId,
                                },
                            },
                            update: {},
                            create: learningPathCourse,
                        });
                    })
                );

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
