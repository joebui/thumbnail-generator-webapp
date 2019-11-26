const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async event => {
  const request = event.Records[0].cf.request;

  try {
    if (request.uri && request.headers['accept-encoding']) {
      const acceptEncoding = request.headers['accept-encoding'][0].value;

      if (acceptEncoding.includes('br')) {
        await applyPrecompressedAsset('br', request);
      } else if (acceptEncoding.includes('gzip')) {
        await applyPrecompressedAsset('gz', request);
      }
    }
  } catch (e) {
    console.log(`Error occurred with ${request.uri}: ${JSON.stringify(e)}`);
  } finally {
    return request;
  }
};

function isFileExisted(uri) {
  // update Bucket accordingly.
  return s3.headObject({ Bucket: 'web.dientesting.de', Key: uri }).promise();
}

async function applyPrecompressedAsset(ext, request) {
  const newUri = `${request.uri}.${ext}`;
  await isFileExisted(newUri.substr(1));
  request.uri = newUri;
}
