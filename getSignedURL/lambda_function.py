import boto3
import json
import random
import os

# Change this value to adjust the signed URL's expiration
URL_EXPIRATION_SECONDS = 300

# Main Lambda entry point
def lambda_handler(event, context):
    return get_upload_url(event)

def get_upload_url(event):
    s3 = boto3.client('s3')
    random_id = str(random.randint(1, 10000000))
    key = f"{random_id}-video.mp4"

    # Generate a presigned URL S3 POST request to upload a file with a specific key
    upload_url = s3.generate_presigned_post(Bucket=os.environ['UploadBucket'],
                                            Key=key,
                                            Fields={'acl': 'public-read'},
                                            Conditions=[{'acl': 'public-read'}],
                                            ExpiresIn=URL_EXPIRATION_SECONDS)
    
    # Construct the response object
    response = {
        "statusCode": 200,
        "headers": {
            "content-type": "application/json; charset=utf-8"
        },
        "body": json.dumps({
            'uploadURL': {
                'url': upload_url['url'],  # URL to send the POST request to
                'fields': upload_url['fields']  # Fields to include in the POST request
            },
            'Key': key,  # The key that should be used to access the file after upload
            'objectURL': f"https://{os.environ['UploadBucket']}.s3.eu-north-1.amazonaws.com/{key}"  # Public URL to access the uploaded file
        })
    }

    return response
