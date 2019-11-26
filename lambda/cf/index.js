const mime = require('mime-types');

exports.handler = (event, context, callback) => {
  const response = event.Records[0].cf.response;
  const requestUri = event.Records[0].cf.request.uri;

  try {
    if (requestUri.endsWith('.br')) {
      addContentHeaders('br', response, requestUri, '.br');
    } else if (requestUri.endsWith('.gz')) {
      addContentHeaders('gzip', response, requestUri, '.gz');
    }
  } catch (e) {
    console.log(`Error occurred with with ${requestUri}: ${JSON.stringify(e)}`);
  } finally {
    callback(null, response);
  }
};

function addContentHeaders(value, response, requestUri, ext) {
  response.headers['content-encoding'] = [
    {
      key: 'Content-Encoding',
      value,
    },
  ];
  response.headers['content-type'] = [
    {
      key: 'Content-Type',
      value: mime.lookup(requestUri.replace(ext, '')),
    },
  ];
}
