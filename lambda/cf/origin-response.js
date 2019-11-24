exports.handler = (event, context, callback) => {
  const response = event.Records[0].cf.response;
  const requestUri = event.Records[0].cf.request.uri;

  try {
    if (requestUri.endsWith('.gz')) {
      addContentEncoding('gzip', response);
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
