import axios from "axios";

import { env } from "env/client.mjs";

export const uploadOne = async (file: File) => {
  try {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "karentstatic");
    data.append(`api_key`, env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    data.append("tags", "navu");
    data.append("folder", "navu");
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/dpnbddror/upload`,
      data
    );
    const uploadedMedia = {
      success: 1,
      file: {
        url: res.data.secure_url as string,
        public_id: res.data.public_id as string,
      },
    };
    return uploadedMedia;
  } catch (error) {
    return {
      success: 0,
      file: {
        url: "Something went wrong",
        public_id: "Something went wrong",
      },
    };
  }
};
