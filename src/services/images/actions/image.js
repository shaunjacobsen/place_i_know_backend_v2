const { cloudinary } = require('./../cloudinary/config');

module.exports = {
  removeImageFromCloudinary: publicId => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .destroy(publicId, {
          invalidate: true,
        })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  },
};
