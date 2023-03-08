import type { NextApiRequest, NextApiResponse } from "next";

import { env } from "env/server.mjs";

import cloudinary from 'cloudinary';

import {
    getServerSession,
} from "next-auth";

import { authOptions } from "auth/auth";

// Configure Cloudinary with your account credentials
cloudinary.v2.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
});


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /*
    API endpoint to 1) upload new image.  2) delete an image. GET request.
    */

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    switch (req.method) {
        case "DELETE":

            const { public_id } = req.body;

            cloudinary.v2.uploader.destroy(public_id, function (result: unknown) {
                console.log(result);
            });

            res.status(200).json({ message: `Image deleted.` });

        default:
            break;
    }

}


export default handler;

