import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // get customerId from query params
    const { customerId } = req.query;


    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction?customer=${customerId}`,
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
            'Content-Type': 'application/json'
        }
    };

    const paystackReq = https.request(options, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            const responseData = JSON.parse(data);

            if (responseData.status) {
                const transactionData = responseData.data;

                res.status(200).json({ message: 'Customer transcations fetched', data: transactionData });
            } else {
                res.status(400).json({ message: 'Could not get customer transcations' });
            }
        });
    });

    paystackReq.on('error', (error) => {
        res.status(500).json({ message: error.message });
    });

    paystackReq.end();
};

export default handler;
