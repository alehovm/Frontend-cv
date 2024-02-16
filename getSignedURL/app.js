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

'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3()

// Change this value to adjust the signed URL's expiration
const URL_EXPIRATION_SECONDS = 300

// Main Lambda entry point
exports.handler = async (event) => {
  return await getUploadURL(event)
}

const getUploadURL = async function(event) {
  const randomID = parseInt(Math.random() * 10000000)
  const Key = `${randomID}-video.mp4`

  // Get signed URL from S3
  const s3Params = {
    Bucket: process.env.UploadBucket,
    Key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: 'video/mp4',
    ACL: 'public-read',
    Policy: 'eyJleHBpcmF0aW9uIjogIjIwMjQtMDItMTZUMTI6MDY6NDZaIiwgImNvbmRpdGlvbnMiOiBbeyJhY2wiOiAicHVibGljLXJlYWQifSwgeyJidWNrZXQiOiAic29wcmEtZGlnaXRhbGlzZXJpbmctY3YtcG9jIn0sIHsia2V5IjogIjk3ODA5Ny12aWRlby5tcDQifSwgeyJ4LWFtei1hbGdvcml0aG0iOiAiQVdTNC1ITUFDLVNIQTI1NiJ9LCB7IngtYW16LWNyZWRlbnRpYWwiOiAiQVNJQTJMS0ZPNlFJN0NVU1FQVkovMjAyNDAyMTYvZXUtbm9ydGgtMS9zMy9hd3M0X3JlcXVlc3QifSwgeyJ4LWFtei1kYXRlIjogIjIwMjQwMjE2VDExMDY0NloifSwgeyJ4LWFtei1zZWN1cml0eS10b2tlbiI6ICJJUW9KYjNKcFoybHVYMlZqRU9QLy8vLy8vLy8vL3dFYUNtVjFMVzV2Y25Sb0xURWlSekJGQWlBZW5iTTBtZ1lWMC90T0dCQ2RWMWlNQkV1cWYrdTg2aXpEdGdweXdxUkJ1d0loQU4za1p3Y3U5TkZXcE40TG9RLzgxcGcrU1I1eTQxaHY2QjJCTnpnUi9ybE5LdkFDQ0x6Ly8vLy8vLy8vL3dFUUF4b01OekV4TkRrNU5qUXhPRGN6SWd3dzM4cThMZERGNXVxenNoOHF4QUw3Y2k0MmxuOGY4WEdwYXgrU1pHY0xsWCtBZ2hWVS92MENQbXFWb05iZzFlVElMNkVmMkUxRE01dmtWZG9RSzNOWGJyMzBLSkJiMDZDbSt6VXplOGdHMUNMdVZ2enQyZy9QSlExNy9sZXZCWlh6V29QMjZLRHB4WGFXWEdqTUhSZkNmTzFsNm1yUVlzZUVWWkFobjhNcWpGVUpnUWJGUnBLSlVEaWlGUXdrbWRHd2xJUDFKalhnVWxTZDhxU0V0c3BsRDZZYjBnNmNaN2FaYXZYNU5zQjVhRFZUZ0k5SUxrSFYzSGdLQlFlVDFuS2dVOVhCV3dJSkFBRk1CelAyUjJkQTFabzQwa2JsZHRuaTJaYVdzN3UvdXpHTk5yMFVpRGpMOStRZit2SnE5N3pIanBpaWlWZG1NamExc2dzaUI2ZC9Zc2ltY3FNRlA1d2d0V3ZzcXpDMGNiTDNOZWlsVkNKaVVhdDZJLy9jUHI1MHExS2pacWlxMU1Bbm9UUTRaVVVkbktHOHVDeWo5VEFTTlBLRXV4UTZDMit1TUFYMlRic2dzWlNmNnNSdE1WWFBNaVl3dVlDOXJnWTZuZ0U2aEV5UFJrYS84MkJBN09RVnUrQis5cFFJc2xhRzFUd29mSHNBYm9GampZclRJZE5tR2s0dkNmdVU1Z3oxSnZBTUcwa3NkNVNlbHZSQkI1STdMQnFRSGh2Sk4xVW0yd0JsaGJVRVhpNVhjQUpVZU9OUVR0M1V3NnNRNVk4a3k0NDBvN2M1V0prejdXUmVXYVN1a3llb1JhRzY0MDQwZHRsL1FUaHBKNzRFWW9mSFhtdUZIOGVZTXd3TysxSEpOZkFYYWxOMEl5SXVZd3JiT3NJNlVnPT0ifV19',
    AMZAlgorithm: 'AWS4-HMAC-SHA256',
    AMZSecurityToken: 'IQoJb3JpZ2luX2VjELP//////////wEaCmV1LW5vcnRoLTEiRzBFAiBVNQqRXECccsGZ/MXxtePeqEgeRIK/dv1QbugLV48PvAIhAMS/Nn7e5a0+qWst4HAy2oaxBuPkund3FVfAscijKDVBKvACCI3//////////wEQAxoMNzExNDk5NjQxODczIgw1vbKWYQ0Fn7n3/qUqxAJKBsHDN8LRcrchEpyZG6l2+EjIZRLN04ib/fb2VpSCRVAPEF7aWAsJWkaMx7dIrvRLs5FtyU/JWFc3GRKAEhHI8xCfEdq7fb7XvVYo1mwEOn851x1UR5KzFgnEmzlCeCjXQ1729h46z5K0CQJbbraU0gOvPoToH5Vf7FPts2xBMQ/+8sGCmthwP5jUCWl0HhKS9xlK9v5P+vPuQjPlLcjfrYIK51cD0wDL/6hYeGGBywHvHYeAfR38r7yafNYYn3JVL9wkSvoRXDYHmnINioFyeXwwxOMn8/xvSzGARJf4cC3xXM2LoDO4A97n/VegnRhiJh3tI7PBdIPJws6ceLBY13uGMTw/kUkq9HHfLrZ0y8QZ8CeVsw+SdL8UWMo5NOyxzrWoC8b3O/yhE0jDF1ddwhef48Cmgd6VFTF8TfjhnEm3Leww6ceyrgY6ngG0h/LHU88KaxwMleaJ1d6tu2j66ZKTIIIpHhEVR4DaEpA3IWNsh1ZfTG9/vOyYM6RTtwYIhzusVkOFDrzRiMQu0smGFr6fOdyuv5GbNxIp0Bx1geulhvtCc2XipgwQC7FO5tP4ThzEa1fwpGLoRwfXg/z4hIzaxJvSJW0GUKSH+xejHn2KIptfm+hqNk84kandxMjy1zp0DqA34vrCnA==',
    AMZCredential: 'ASIA2LKFO6QIYEDLDO4S/20240214/eu-north-1/s3/aws4_request',

    

    // This ACL makes the uploaded object publicly readable. You must also uncomment
    // the extra permission for the Lambda function in the SAM template. s

  
  }

  console.log('Params: ', s3Params)
  const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)

  return JSON.stringify({
    uploadURL: uploadURL,
    Key
  })
}