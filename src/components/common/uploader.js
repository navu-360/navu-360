import axios from "axios";

import { env } from "env/client.mjs";

let uploadedMedia = [];

const uploadOne = async (files) => {
  const responses = [];
  uploadedMedia = [];
  for (let i = 0; i < files.length; i++) {
    const image = files[i];

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "karentstatic");
    data.append(`api_key`, env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    data.append("tags", "navu");
    data.append("folder", "navu");
    responses.push(
      await axios.post(`https://api.cloudinary.com/v1_1/dpnbddror/upload`, data)
    );
  }
  // add responses as objects to uploadedMedia array
  for (let i = 0; i < responses.length; i++) {
    const ImageObj = {
      url: responses[i].data.secure_url,
      public_id: responses[i].data.public_id,
    };
    uploadedMedia.push(ImageObj);
  }
  return uploadedMedia;
};

export function uploadAllToCloudinary(files) {
  if (files.length === 0) return [];
  // later
  return uploadOne(files);
}
