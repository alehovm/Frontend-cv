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

// Main Lambda entry point
exports.handler = async (event) => {
  return await getUploadURL(event)
}

const getUploadURL = async function(event) {
  const randomID = parseInt(Math.random() * 10000000)
  const Key = `${randomID}.mp4`

  // Get signed URL from S3
  const s3Params = {
    Bucket: process.env.UploadBucket,
    Key,
    ContentType: 'video',
    ACL: 'public-read',
    Policy: 'eyJleHBpcmF0aW9uIjogIjIwMjQtMDItMTRUMTI6Mjg6NDRaIiwgImNvbmRpdGlvbnMiOiBbeyJhY2wiOiAicHVibGljLXJlYWQiLCAiQ29udGVudFR5cGUiOiAidmlkZW8vKiJ9LCB7ImJ1Y2tldCI6ICJzb3ByYS1kaWdpdGFsaXNlcmluZy1jdi1wb2MifSwgeyJrZXkiOiAiNjEwMzY5OS12aWRlby5tcDQifSwgeyJ4LWFtei1hbGdvcml0aG0iOiAiQVdTNC1ITUFDLVNIQTI1NiJ9LCB7IngtYW16LWNyZWRlbnRpYWwiOiAiQVNJQTJMS0ZPNlFJWUVETERPNFMvMjAyNDAyMTQvZXUtbm9ydGgtMS9zMy9hd3M0X3JlcXVlc3QifSwgeyJ4LWFtei1kYXRlIjogIjIwMjQwMjE0VDExMjg0NFoifSwgeyJ4LWFtei1zZWN1cml0eS10b2tlbiI6ICJJUW9KYjNKcFoybHVYMlZqRUxQLy8vLy8vLy8vL3dFYUNtVjFMVzV2Y25Sb0xURWlSekJGQWlCVk5RcVJYRUNjY3NHWi9NWHh0ZVBlcUVnZVJJSy9kdjFRYnVnTFY0OFB2QUloQU1TL05uN2U1YTArcVdzdDRIQXkyb2F4QnVQa3VuZDNGVmZBc2NpaktEVkJLdkFDQ0kzLy8vLy8vLy8vL3dFUUF4b01OekV4TkRrNU5qUXhPRGN6SWd3MXZiS1dZUTBGbjduMy9xVXF4QUpLQnNIRE44TFJjcmNoRXB5Wkc2bDIrRWpJWlJMTjA0aWIvZmIyVnBTQ1JWQVBFRjdhV0FzSldrYU14N2RJcnZSTHM1RnR5VS9KV0ZjM0dSS0FFaEhJOHhDZkVkcTdmYjdYdlZZbzFtd0VPbjg1MXgxVVI1S3pGZ25FbXpsQ2VDalhRMTcyOWg0Nno1SzBDUUpiYnJhVTBnT3ZQb1RvSDVWZjdGUHRzMnhCTVEvKzhzR0NtdGh3UDVqVUNXbDBIaEtTOXhsSzl2NVArdlB1UWpQbExjamZyWUlLNTFjRDB3REwvNmhZZUdHQnl3SHZIWWVBZlIzOHI3eWFmTllZbjNKVkw5d2tTdm9SWERZSG1uSU5pb0Z5ZVh3d3hPTW44L3h2U3pHQVJKZjRjQzN4WE0yTG9ETzRBOTduL1ZlZ25SaGlKaDN0STdQQmRJUEp3czZjZUxCWTEzdUdNVHcva1VrcTlISGZMcloweThRWjhDZVZzdytTZEw4VVdNbzVOT3l4enJXb0M4YjNPL3loRTBqREYxZGR3aGVmNDhDbWdkNlZGVEY4VGZqaG5FbTNMZXd3NmNleXJnWTZuZ0cwaC9MSFU4OEtheHdNbGVhSjFkNnR1Mmo2NlpLVElJSXBIaEVWUjREYUVwQTNJV05zaDFaZlRHOS92T3lZTTZSVHR3WUloenVzVmtPRkRyelJpTVF1MHNtR0ZyNmZPZHl1djVHYk54SXAwQngxZ2V1bGh2dENjMlhpcGd3UUM3Rk81dFA0VGh6RWExZndwR0xvUndmWGcvejRoSXpheEp2U0pXMEdVS1NIK3hlakhuMktJcHRmbStocU5rODRrYW5keE1qeTF6cDBEcUEzNHZyQ25BPT0ifV19'
    
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