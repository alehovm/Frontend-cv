# Backend (Lambda function)
import boto3
import json
import random
import os

# Change this value to adjust the signed URL's expiration
URL_EXPIRATION_SECONDS = 300

def lambda_handler(event, context):
    return get_upload_url(event)

def get_upload_url(event):
    s3 = boto3.client('s3')
    random_id = str(random.randint(1, 10000000))
    key = f"{random_id}-video.mp4"

    try:
        upload_url = s3.generate_presigned_post(Bucket=os.environ['UploadBucket'],
                                                Key=key,
                                                Fields={'acl': 'public-read'},
                                                Conditions=[{'acl': 'public-read'}],
                                                ExpiresIn=URL_EXPIRATION_SECONDS)
    except s3.exceptions.S3Error as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps('Error generating presigned URL')
        }

    objectURL = f"https://{os.environ['UploadBucket']}.s3.amazonaws.com/{key}"
    
    # Note that responseBody is a dict, not a string
    responseBody = {
        'uploadURL': {
            'url': upload_url['url'],
            'fields': upload_url['fields']
        },
        'Key': key,
        'objectURL': objectURL
    }

    # The entire responseBody is JSON stringified, not just the upload_url
    return {
        "statusCode": 200,
        "headers": {
            "content-type": "application/json; charset=utf-8"
        },
        "body": json.dumps(responseBody)
    }
