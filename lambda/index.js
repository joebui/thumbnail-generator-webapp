const AWS = require('aws-sdk');
const imageThumbnail = require('image-thumbnail');
const mime = require('mime-types');
const uuid = require('uuid/v4');

const s3 = new AWS.S3();

async function getObject(params) {
  return s3.getObject(params).promise();
}

async function generateThumbnail(data) {
  return imageThumbnail(data, {
    width: 50,
    height: 50,
  });
}

async function uploadThumbnail(params) {
  return s3.putObject(params).promise();
}

exports.handler = async event => {
  const s3Bucket = event['Records'][0]['s3'];
  const objectKey = s3Bucket.object.key;
  if (objectKey.includes('thumbnails')) return;

  const mimeType = mime.lookup(objectKey);
  // Get object buffer.
  const data = await getObject({
    Bucket: s3Bucket.bucket.name,
    Key: objectKey,
  });
  // Generate thumbnail.
  const thumbnailBuffer = await generateThumbnail(data.Body);
  // Upload thumbnail to S3.
  const result = await uploadThumbnail({
    Bucket: s3Bucket.bucket.name,
    Key: `thumbnails/${uuid()}.${mime.extension(mimeType)}`,
    Body: thumbnailBuffer,
    ContentType: mimeType,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
