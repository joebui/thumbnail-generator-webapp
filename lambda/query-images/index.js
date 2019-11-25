const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const cdnDomain = 'https://content.dientesting.de';

exports.handler = async event => {
  const params = {
    TableName: 'images',
  };

  const data = await docClient.scan(params).promise();
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data: data.Items.map(({ name, thumbnail }) => ({
          name: `${cdnDomain}/${name}`,
          thumbnail: `${cdnDomain}/${thumbnail}`,
        })),
      },
      null,
      2,
    ),
  };
};
