import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /*
      API endpoint to 1) accept an invite
      */

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    switch (req.method) {
        case "POST":
            try {
                const {
                    image: toEdit,
                    inviteId
                } = req.body as {
                    image: string;
                    inviteId: string;
                };

                // get invite by inviteId
                const invite = await prisma.invites.findUnique({
                    where: {
                        id: inviteId,
                    },
                });

                // compare session user email with invite email
                if (invite?.email !== session.user.email) {
                    // delete user
                    await prisma.user.delete({
                        where: {
                            email: session.user.email,
                        },
                    }).catch((error) => {
                        console.log("error deleting user", error);
                    });

                    res.status(401).json({ message: `Unauthorized. Please use the email you received the invite on` });
                    return;
                }

                if (!invite) {
                    res.status(404).json({ message: `Invite not found.` });
                    return;
                }

                // check if expired - 24hrs since invite was created
                const now = new Date();
                const createdAt = new Date(invite.createdAt);
                const diff = now.getTime() - createdAt.getTime();
                const diffInHours = diff / (1000 * 3600);
                if (diffInHours > 24) {
                    res.status(400).json({ message: `Invite has expired.` });
                    return;
                }


                // validations
                // 1. A user can only belong to one organization. Check if the user already belongs to an organization.
                const user = await prisma.user.findUnique({
                    where: {
                        email: session.user.email,
                    },
                });

                if (user?.talentOrgId) {
                    res
                        .status(400)
                        .json({
                            message: `${user.name} already belongs to an organization.`,
                        });
                    return;
                }

                const userToEdit = await prisma.user.update({
                    where: {
                        email: session.user.email,
                    },
                    data: {
                        image: toEdit,
                        position: "",
                        role: "talent",
                        hasBeenOnboarded: true,
                        talentOrgId: invite.orgId,
                    },
                });

                return res
                    .status(200)
                    .json({
                        message: `User ${userToEdit.name} updated.`,
                        data: userToEdit,
                    });
            } catch (error) {
                return res
                    .status(500)
                    // @ts-ignore
                    .json({ message: error.message });
            }

        default:
            res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }
};

export default handler;
