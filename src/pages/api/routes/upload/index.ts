import type { NextApiRequest, NextApiResponse } from "next";

import { env } from "env/server.mjs";

import cloudinary from 'cloudinary';
import multer from 'multer';

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

const upload = multer({ storage: multer.memoryStorage() });

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
        case "POST":



        // res.status(201).json({ message: `Image uploaded.` });

        default:
            break;
    }

}


// const sign = async (req, res) => {
//     const timestamp = Math.round((new Date()).getTime() / 1000);

//     const signature = cloudinary.v2.utils.api_sign_request({
//         timestamp: timestamp,
//         folder: 'product'
//     }, env.CLOUDINARY_API_SECRET);

//     res.statusCode = 200;
//     res.json({ signature, timestamp });
// };


export default handler;

