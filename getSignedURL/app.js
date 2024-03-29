/*
  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify,
  merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// 'use strict'

// const AWS = require('aws-sdk')
// AWS.config.update({ region: process.env.AWS_REGION })
// const s3 = new AWS.S3()

// // Change this value to adjust the signed URL's expiration

// // Main Lambda entry point
// exports.handler = async (event) => {
//   return await getUploadURL(event)
// }

// const getUploadURL = async function(event) {
//   const randomID = parseInt(Math.random() * 10000000)
//   const Key = `${randomID}.mp4`

//   // Get signed URL from S3
//   const s3Params = {
//     Bucket: process.env.UploadBucket,
//     Key,
//     ContentType: 'video/*',
//     ACL: 'public-read',
    
//     // This ACL makes the uploaded object publicly readable. You must also uncomment
//     // the extra permission for the Lambda function in the SAM template. s

  
//   }

//   console.log('Params: ', s3Params)
//   const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)

//   return JSON.stringify({
//     uploadURL: uploadURL,
//     Key
//   })
// }
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const URL_EXPIRATION_SECONDS = 300;

exports.handler = async (event) => {
    return await getUploadUrl();
};

async function getUploadUrl() {
    const randomId = Math.floor(Math.random() * 10000000).toString();
    const key = `${randomId}-video.mp4`;

    const uploadBucket = process.env.UploadBucket;
    const params = {
        Bucket: uploadBucket,
        Key: key,
        Expires: URL_EXPIRATION_SECONDS,
        ContentType: 'video/mp4', // Specify if you want to enforce this content type
        ACL: 'public-read' // Only if you need the uploaded object to be publicly readable
    };

    try {
        const uploadURL = await s3.getSignedUrlPromise('putObject', params);
        const objectURL = `https://${uploadBucket}.s3.amazonaws.com/${key}`;
        
        return {
            statusCode: 200,
            headers: {
                "content-type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                uploadURL: uploadURL,
                objectURL: objectURL
            })
        };
    } catch (err) {
        console.log('Error generating signed URL', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error generating signed URL" })
        };
    }
}

