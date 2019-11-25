const AWS = require('aws-sdk');
const imageThumbnail = require('image-thumbnail');
const mime = require('mime-types');
const uuid = require('uuid/v4');

const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient();

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
  const thumbnailKey = `thumbnails/${uuid()}.${mime.extension(mimeType)}`;
  await uploadThumbnail({
    Bucket: s3Bucket.bucket.name,
    Key: thumbnailKey,
    Body: thumbnailBuffer,
    ContentType: mimeType,
  });
  // add image to DynamoDB.
  await createImagesItem({ name: objectKey, thumbnail: thumbnailKey });

  return;
};

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

const createImagesItem = async item => {
  const params = {
    TableName: 'images',
    Item: item,
  };

  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
