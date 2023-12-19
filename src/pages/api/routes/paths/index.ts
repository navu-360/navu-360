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
        // name, description, and course IDs
        const { name, description, courseIds } = req.body as {
          name: string;
          description: string;
          courseIds: string[];
        };

        if (!name || !description || !courseIds) {
          return res.status(400).json({ message: `Missing fields.` });
        }

        const organization = await prisma.organization.findFirst({
          where: {
            userId: session?.user?.id as string,
          },
          select: {
            id: true,
          }
        });

        if (!organization) {
          return res.status(400).json({ message: `Organization not found.` });
        }

        // create module
        const newLearningPath = await prisma.learningPath.create({
          data: {
            name,
            description,
            orgId: organization?.id,
          }
        });
        // create LearningPathCourse: moduleId, courseId
        const learningPathCourses = courseIds.map((courseId) => {
          return {
            moduleId: newLearningPath.id,
            courseId,
          };
        });
        await prisma.learningPathCourse.createMany({
          data: learningPathCourses,
        });

        return res.status(200).json({ message: `Learning path created.` });


      } catch (error) {
        return res
          .status(500)
          // @ts-ignore
          .json({ message: error.message });
      }

    case "PUT":
      try {
        // name, description, and course IDs
        const { name, description, courseIds, learningPathId } = req.body as {
          name: string;
          description: string;
          courseIds: string[];
          learningPathId: string;
        };

        if (!name || !description || !courseIds || !learningPathId) {
          return res.status(400).json({ message: `Missing fields.` });
        }

        const organization = await prisma.organization.findFirst({
          where: {
            userId: session?.user?.id as string,
          },
          select: {
            id: true,
          }
        });

        if (!organization) {
          return res.status(400).json({ message: `Organization not found.` });
        }

        // update module
        await prisma.learningPath.update({
          where: {
            id: learningPathId,
          },
          data: {
            name,
            description,
          }
        });

        return res.status(200).json({ message: `Learning path updated.` });


      } catch (error) {
        return res
          .status(500)
          // @ts-ignore
          .json({ message: error.message });
      }
    case "DELETE":
      try {
        const { learningPathId } = req.body as {
          learningPathId: string;
        };

        if (!learningPathId) {
          return res.status(400).json({ message: `Missing fields.` });
        }

        const organization = await prisma.organization.findFirst({
          where: {
            userId: session?.user?.id as string,
          },
          select: {
            id: true,
          }
        });

        if (!organization) {
          return res.status(400).json({ message: `Organization not found.` });
        }

        // delete module
        await prisma.learningPath.delete({
          where: {
            id: learningPathId,
          },
        });

        return res.status(200).json({ message: `Learning path deleted.` });
      }
      catch (error) {
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
