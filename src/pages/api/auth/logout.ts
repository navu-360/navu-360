import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const returnTo = encodeURI(process.env.NEXTAUTH_URL as string);
    console.log(returnTo);
    res.redirect(`${process.env.AUTH0_DOMAIN}/oidc/logout?client_id=${process.env.AUTH0_CLIENT_ID}&post_logout_redirect_uri=${returnTo}`);
}