var AWS = require('aws-sdk');
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "../config/config";

export const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: 'eu-west-2',
});

AWS.config.update({
    region: 'eu-west-2',
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});