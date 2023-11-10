import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import axios from "axios";

import { authOptions } from "auth/auth";
import { prisma } from "auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    // endpoints for managing custom domains: create, edit, delete
    switch (req.method) {
        case "POST":
            try {
                const organization = await prisma.organization.findFirst({
                    where: {
                        userId: session.user.id,
                    },
                    select: {
                        domain: true,
                    },
                });

                if (organization?.domain) {
                    res
                        .status(400)
                        .json({
                            message: `You already have a custom domain: ${organization?.domain}.navu360.com`,
                        });
                    return;
                }

                const { domain } = req.body as { domain: string };

                // check if domain exists in zone already
                const options = {
                    method: "GET",
                    url: `${process.env.CLOUDFLARE_BASE_API_URL}/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records?type=CNAME&name=${removeSpacesAndLowerCase(domain)}.navu360.com`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    },
                };

                axios
                    .request(options)
                    .then(function (response) {
                        if (response.data.result > 0) {
                            return res
                                .status(400)
                                .json({ message: `Domain already exists.` });
                        }
                    })
                    .catch(function (error) {
                        console.error(error?.response?.data?.errors);
                        return res.status(500).json({
                            message: `Failed to check if domain exists.`,
                        });
                    });

                // create sub domain in Vercel first, then get back the setup details, use in the below content
                const vercelOptions = {
                    method: "POST",
                    url: `https://api.vercel.com/v10/projects/navu-360/domains`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
                    },
                    data: {
                        name: `${removeSpacesAndLowerCase(domain)}.navu360.com`,
                    }
                }
                const vercelResponse = await axios.request(vercelOptions);
                console.log(vercelResponse.data);

                // create domain in zone
                const createOptions = {
                    method: "POST",
                    url: `${process.env.CLOUDFLARE_BASE_API_URL}/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    },
                    data: {
                        content: "cname.vercel-dns.com.",
                        name: `${removeSpacesAndLowerCase(domain)}`,
                        proxied: false,
                        type: "CNAME",
                        comment: `Custom domain for ${session.user.email}`,
                        ttl: 1,
                    },
                };

                axios
                    .request(createOptions)
                    .then(function () {
                        // we update organization with the domain
                        prisma.organization
                            .update({
                                where: {
                                    userId: session.user.id,
                                },
                                data: {
                                    domain: removeSpacesAndLowerCase(domain),
                                },
                            })
                            .then(() => {
                                console.log("Organization updated with domain.");
                            })
                            .catch((error) => {
                                console.error(error);
                                return res.status(500).json({
                                    message: `Failed to update organization with domain.`,
                                });
                            });
                    })
                    .catch(function (error) {
                        console.error(error?.response?.data?.errors);
                        return res.status(500).json({
                            message: `Failed to create domain.`,
                        });
                    });

                res.status(200).json({ message: `Custom domain created.` });
            } catch (error: unknown) {
                // @ts-ignore
                res.status(500).json({ message: error.message });
            }
        case "PATCH":
            try {
                const organization = await prisma.organization.findFirst({
                    where: {
                        userId: session.user.id,
                    },
                    select: {
                        domain: true,
                    },
                });

                if (!organization?.domain) {
                    res
                        .status(400)
                        .json({
                            message: `You do not have a custom domain.`,
                        });
                    return;
                }

                const { domain } = req.body as { domain: string };

                // check if domain exists in zone already
                const options = {
                    method: "GET",
                    url: `${process.env.CLOUDFLARE_BASE_API_URL}/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records?type=CNAME&name=${organization?.domain}.navu360.com`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    },
                };

                let recordId = "";
                axios
                    .request(options)
                    .then(function (response) {
                        if (response.data.result.length === 0) {
                            return res
                                .status(400)
                                .json({ message: `Domain does not exist.` });
                        }
                        console.log(response.data);
                        recordId = response.data.result[0].id;

                    })
                    .catch(function (error) {
                        console.error(error?.response?.data?.errors);
                        return res.status(500).json({
                            message: `Failed to check if domain exists.`,
                        });
                    });

                // create sub domain in Vercel first, then get back the setup details, use in the below content
                const vercelOptions = {
                    method: "POST",
                    url: `https://api.vercel.com/v10/projects/navu-360/domains`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
                    },
                    data: {
                        name: `${removeSpacesAndLowerCase(domain)}.navu360.com`,
                    }
                }
                const vercelResponse = await axios.request(vercelOptions);
                console.log(vercelResponse.data);

                // create domain in zone
                const createOptions = {
                    method: "PUT",
                    url: `${process.env.CLOUDFLARE_BASE_API_URL}/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records/${recordId}`,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    },
                    data: {
                        content: "cname.vercel-dns.com.",
                        name: `${removeSpacesAndLowerCase(domain)}`,
                        proxied: false,
                        type: "CNAME",
                        comment: `
                            Custom domain for ${session.user.email}
                        `,
                        ttl: 1,
                    },
                };

                axios
                    .request(createOptions)
                    .then(async function () {
                        // delete domain
                        const responseDelete = await fetch(`https://api.vercel.com/v9/projects/navu-360/domains/${organization?.domain}.navu360.com`, {
                            "headers": {
                                "Authorization": `Bearer ${process.env.VERCEL_TOKEN}`,
                            },
                            "method": "delete"
                        })
                        console.log(responseDelete?.ok);
                        // we update organization with the domain
                        prisma.organization
                            .update({
                                where: {
                                    userId: session.user.id,
                                },
                                data: {
                                    domain: removeSpacesAndLowerCase(domain),
                                },
                            })
                            .then(() => {
                                console.log("Organization updated with domain.");
                            })
                            .catch((error) => {
                                console.error(error);
                                return res.status(500).json({
                                    message: `Failed to update organization with domain.`,
                                });
                            });
                    })
                    .catch(function (error) {
                        console.error(error?.response?.data?.errors);
                        return res.status(500).json({
                            message: `Failed to create domain.`,
                        });
                    });



                res.status(200).json({ message: `Custom domain updated.` });

            } catch (error: unknown) {
                // @ts-ignore
                res.status(500).json({ message: error.message });
            }
        default:
            res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }
};

const removeSpacesAndLowerCase = (str: string) => {
    return str.replace(/\s/g, "").toLowerCase();
}

export default handler;
