import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "blog_users" }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
};
  //cloudinary does not contain the promise and callback functions were used => that's why we make promises here
  // callback were messy and called as callback hell and to overcome that promises created
