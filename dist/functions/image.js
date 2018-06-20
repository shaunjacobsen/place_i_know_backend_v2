var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    assignImage: (type, data) => __awaiter(this, void 0, void 0, function* () {
        const imageId = yield createNewImage(data.imageData);
        switch (type) {
            case 'new_avatar':
                const assign = yield assignNewAvatarImageToUser(data.metaData.userId, imageId);
                return assign;
            default:
                return;
        }
    }),
};
const createNewImage = (data) => __awaiter(this, void 0, void 0, function* () {
    try {
        const newRecord = models.image.build({
            url: data.imageUrl,
            secure_url: data.secureImageUrl,
            cloudinary_public_id: data.publicId,
            format: data.format,
            created: data.created,
        });
        yield newRecord.save();
        return newRecord.image_id;
    }
    catch (e) {
        console.log('error creating new image in db');
        return 43;
    }
});
const assignNewAvatarImageToUser = (userId, imageId) => __awaiter(this, void 0, void 0, function* () {
    try {
        const userToUpdate = yield models.user.findById(userId);
        const updated = yield userToUpdate.update({
            image_id: imageId,
        });
        return updated;
    }
    catch (e) {
        console.log('error assigning image to user');
    }
});
