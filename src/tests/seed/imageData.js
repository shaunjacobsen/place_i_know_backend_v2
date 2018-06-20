const { Image } = require('./../../models/image');

const adminUserImage = {
  url: 'http://res.cloudinary.com/placeiknow/image/upload/v1507902761/faces/grl4afcgrxkwr5tdhd1m.jpg',
  secure_url: 'https://res.cloudinary.com/placeiknow/image/upload/v1507902761/faces/grl4afcgrxkwr5tdhd1m.jpg',
  cloudinary_public_id: 'faces/grl4afcgrxkwr5tdhd1m',
  format: 'jpg'
}

const allImages = [adminUserImage];

const populateImages = async (images) => {
  try {
    await Image.bulkCreate(images);
  } catch (error) {
    console.log('error populating images', error);
  }
}

const destroyImages = async () => {
  try {
    await Image.destroy({ truncate: true });
  } catch (error) {
    
  }
}

module.exports = { allImages, populateImages, destroyImages };