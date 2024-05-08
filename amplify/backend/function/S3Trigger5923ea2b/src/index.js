const sharp = require('sharp');
const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.handler = async function (event) {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));

  // If the vevent type is delete then return from the function
  if(event.Records[0].eventName  === 'ObjectRemoved:Delete') return;

  // Get the bucket name and key from the event
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  console.log(`Bucket: ${bucket}`, `Key: ${key}`);

  try{
    let image = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    image = await sharp(image.Body);

    const metadata = await image.metadata();
    if(metadata.width > 1000){
      const resizedImage = await image.resize({width: 1000}).toBuffer();
      await s3.putObject({
        Bucket: bucket,
        Body: resizedImage,
        Key: key
      }).promise();
    }
    return;
  } catch(err){
    context.fail(`Error getting files: ${err}`);
  }
};