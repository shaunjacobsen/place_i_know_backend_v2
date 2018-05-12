const aws = require('aws-sdk');
aws.config.region = 'us-east-2';
const s3 = new aws.S3();

module.exports = {
  getSignedDownloadUrl: doc => {
    return new Promise((resolve, reject) => {
      s3.getSignedUrl(
        'getObject',
        {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: doc.s3_object,
          Expires: 43200, // 12 hours
          ResponseContentDisposition: `attachment; filename=${doc.title}.pdf`,
        },
        (error, data) => {
          if (error) {
            reject(error);
          }
          resolve({
            signedUrl: data,
          });
        }
      );
    });
  },
  getSignedUploadUrl: (fileName, fileType) => {
    return new Promise((resolve, reject) => {
      s3.getSignedUrl(
        'putObject',
        {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `${fileName}`,
          Expires: 300,
          ContentType: 'application/pdf',
        },
        (error, data) => {
          if (error) {
            reject(error);
          }
          resolve({
            signedUrl: data,
          });
        }
      );
    });
  },
};
