import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "auth/db";
import { authOptions } from "auth/auth";
import sendEnrolledEmail from "../email/enroll";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    switch (req.method) {
        case "POST":
            try {
                // Enrolling One Talent to Many Modules
                // receive talentId and moduleIds.
                const organization = await prisma.organization.findFirst({
                    where: {
                        userId: session?.user?.id as string,
                    },
                    select: {
                        id: true,
                        name: true,
                    }
                });

                if (!organization) {
                    return res.status(400).json({ message: `Organization not found.` });
                }

                // create onboardingProgramTalents for each module
                const { talentId, moduleIds } = req.body as {
                    talentId: string;
                    moduleIds: string[];
                };

                if (!talentId || !moduleIds) {
                    return res.status(400).json({ message: `Missing fields.` });
                }

                const onboardingProgramTalents = moduleIds.map((moduleId) => {
                    return {
                        learningPathId: moduleId,
                        userId: talentId,
                        organizationId: organization.id,
                        programId: ""
                    };
                });

                await prisma.onboardingProgramTalents.createMany({
                    data: onboardingProgramTalents,
                });

                // email talent

                // call sendEnrolledEmail and pass:  programName, talentName, organizationName, talentId, originBaseUrl
                const originBaseUrl = req.headers.origin as string;

                const learningPaths = await prisma.learningPath.findMany({
                    where: {
                        id: {
                            in: moduleIds,
                        },
                    },
                    select: {
                        name: true,
                        // count of courses
                        moduleCourse: {
                            select: {
                                courseId: true,
                            }
                        }
                    }
                });

                const talent = await prisma.user.findUnique({
                    where: {
                        id: talentId,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                });

                if (!talent) {
                    return res.status(400).json({ message: `Talent not found.` });
                }

                const emailResponses = await Promise.all(learningPaths.map(async (learningPath) => {
                    return await sendEnrolledEmail({
                        programName: `learning path - ${learningPath?.name} which has ${learningPath?.moduleCourse.length} courses`,
                        talentName: talent?.name ?? "",
                        organizationName: organization?.name ?? "",
                        talentId: talent.id,
                        originBaseUrl,
                    });
                }));

                console.log(emailResponses);

                return res.status(200).json({ message: `Success.` });

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
