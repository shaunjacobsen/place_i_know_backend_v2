const models = require('./../models');

module.exports = {
  determineFolder: type => {
    switch (type) {
      case 'new_avatar':
        return 'faces';
      default:
        return '';
    }
  },

  assignImage: async (type, data) => {
    const imageId = await createNewImage(data.imageData);
    switch (type) {
      case 'new_avatar':
        const assign = await assignNewAvatarImageToUser(data.metaData.userId, imageId);
        return assign;
      default:
        return;
    }
  },

};

const createNewImage = async data => {
  try {
    const newRecord = models.image.build({
      url: data.imageUrl,
      secure_url: data.secureImageUrl,
      cloudinary_public_id: data.publicId,
      format: data.format,
      created: data.created,
    });
    await newRecord.save();
    return newRecord.image_id;
  } catch (e) {
    console.log('error creating new image in db');
    return 43;
  }
};

const assignNewAvatarImageToUser = async (userId, imageId) => {
  try {
    const userToUpdate = await models.user.findById(userId)
    const updated = await userToUpdate.update({
      image_id: imageId,
    });
    return updated;
  } catch (e) {
    console.log('error assigning image to user');
  }
};
