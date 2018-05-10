const aws = require('aws-sdk');
aws.config.region = 'us-east-2';
const s3 = new aws.S3();

module.exports = {
  getSignedUploadUrl: (fileName, fileType) => {
    return new Promise((resolve, reject) => {
      s3.getSignedUrl(
        'putObject',
        {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: fileName,
          Expires: 60,
          ContentType: fileType,
        },
        (error, data) => {
          if (error) {
            reject(error);
          }
          resolve({
            signedUrl: data,
            url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`,
          });
        }
      );
    });
  },
};
