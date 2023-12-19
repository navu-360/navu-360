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
                // Enrolling Many Talents to a Module
                // receive talentIds and moduleId.
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

                // create onboardingProgramTalents for each talent
                const { talentIds, moduleId } = req.body as {
                    talentIds: string[];
                    moduleId: string;
                };

                if (!talentIds || !moduleId) {
                    return res.status(400).json({ message: `Missing fields.` });
                }

                const onboardingProgramTalents = talentIds.map((talentId) => {
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

                const learningPath = await prisma.learningPath.findUnique({
                    where: {
                        id: moduleId,
                    },
                    select: {
                        name: true,
                        // count of courses
                        ModuleCourse: {
                            select: {
                                courseId: true,
                            }
                        }
                    }
                });

                const talents = await prisma.user.findMany({
                    where: {
                        id: {
                            in: talentIds,
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                });

                const emailResponses = await Promise.all(talents.map(async (talent) => {
                    return await sendEnrolledEmail({
                        programName: `learning path - ${learningPath?.name} which has ${learningPath?.ModuleCourse.length} courses`,
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
