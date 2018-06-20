var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Image } = require('./../../models/image');
const adminUserImage = {
    url: 'http://res.cloudinary.com/placeiknow/image/upload/v1507902761/faces/grl4afcgrxkwr5tdhd1m.jpg',
    secure_url: 'https://res.cloudinary.com/placeiknow/image/upload/v1507902761/faces/grl4afcgrxkwr5tdhd1m.jpg',
    cloudinary_public_id: 'faces/grl4afcgrxkwr5tdhd1m',
    format: 'jpg'
};
const allImages = [adminUserImage];
const populateImages = (images) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield Image.bulkCreate(images);
    }
    catch (error) {
        console.log('error populating images', error);
    }
});
const destroyImages = () => __awaiter(this, void 0, void 0, function* () {
    try {
        yield Image.destroy({ truncate: true });
    }
    catch (error) {
    }
});
module.exports = { allImages, populateImages, destroyImages };
