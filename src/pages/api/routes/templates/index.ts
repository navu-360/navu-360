import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /*
    API endpoint to 1) create a new template. POST request
    */

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: `Unauthorized.` });
    return;
  }

  switch (req.method) {
    case "POST":
      try {
        // receive: name, id, content
        const { name, content } = req.body as {
          name: string;
          id: string;
          content: string;
        };

        if (!name || !content) {
          res.status(400).json({ message: `Missing required fields` });
          return;
        }

        const template = await prisma.template.create({
          data: {
            name,
            content,
          },
        });

        return res.status(200).json({
          data: template,
          message: `Template created successfully.`,
        });
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
