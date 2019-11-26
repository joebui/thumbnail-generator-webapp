exports.handler = (event, context, callback) => {
  const response = event.Records[0].cf.response;
  const requestUri = event.Records[0].cf.request.uri;

  try {
    if (requestUri.endsWith('.br')) {
      // decode using brotli algorithm.
      addContentEncoding('br', response);
    } else {
      if (requestUri.endsWith('.gz')) {
        // decode using gzip algorithm.
        addContentEncoding('gzip', response);
      }
    }
  } catch (e) {
    console.log(`Error occurred with with ${requestUri}: ${JSON.stringify(e)}`);
  } finally {
    callback(null, response);
  }
};

function addContentEncoding(value, response) {
  // add headers.
  response.headers['content-encoding'] = [
    {
      key: 'Content-Encoding',
      value,
    },
  ];
}
