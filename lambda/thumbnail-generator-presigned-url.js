const AWS = require('aws-sdk');

const s3 = new AWS.S3();

module.exports.getPreSignedUrl = async event => {
  const url = await new Promise((resolve, reject) => {
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: '',
        ContentType: event.queryStringParameters.type,
        Key: event.queryStringParameters.key,
      },
      (err, url) => {
        err ? reject(err) : resolve(url);
      },
    );
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        url,
      },
      null,
      2,
    ),
  };
};
