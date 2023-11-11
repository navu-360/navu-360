import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /*
    API endpoint to 1) create a new program. POST request
    */

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: `Unauthorized.` });
    return;
  }

  switch (req.method) {
    case "POST":
      try {
        // name, content
        const { name, categories, imageLink, description } = req.body as {
          name: string;
          content: string;
          categories: string[];
          imageLink: string;
          description: string;
        };


        if (!name || !categories || !imageLink || !description) return res.status(400).json({ message: `Missing fields.` });

        const organization = await prisma.organization.findFirst({
          where: {
            userId: session?.user?.id as string,
          },
          select: {
            id: true,
            freeTrialCoursesIds: true
          }
        });

        if (!organization) return res.status(404).json({ message: `Organization not found.` });

        // check if user is on free plan, then check if they reached limit of 3 trial courses
        if (!session?.user?.customerId && organization?.freeTrialCoursesIds?.length === 5) {
          return res.status(402).json({ message: `You have reached the limit of 3 trial courses. Please upgrade to a paid plan to enjoy unlimited courses.` });
        }

        const program = await prisma.onboardingProgram.create({
          data: {
            name,
            createdBy: session?.user?.id,
            organizationId: organization.id,
            categories,
            image: imageLink,
            description
          },
        });

        // if user is on free plan, we add courseID to freeTrialCoursesIds on org
        if (!session?.user?.customerId) {
          await prisma.organization.update({
            where: {
              id: organization.id,
            },
            data: {
              freeTrialCoursesIds: {
                push: program.id
              }
            }
          })
        }

        return res
          .status(200)
          .json({ message: `Program created.`, data: program });
      } catch (error) {
        return res
          .status(500)
          // @ts-ignore
          .json({ message: error.message });
      }

    case "GET":
      try {
        const { orgId } = req.query as { orgId: string };
        const programs = await prisma.onboardingProgram.findMany({
          where: {
            organizationId: orgId,
          },
          include: {
            _count: {
              select: {
                QuizQuestion: true,
                ProgramSection: true,
              }
            },
            creator: {
              select: {
                name: true,
                id: true,
              }
            }
          },
          orderBy: {
            createdAt: "desc",
          },
          cacheStrategy: {
            ttl: 60,
            swr: 10,
          },
        });

        return res
          .status(200)
          .json({ message: `Programs fetched.`, data: programs });
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
