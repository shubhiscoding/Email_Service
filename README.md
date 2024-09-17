# TG_Bot
Running The Bot:

create a .env file with the following details:
```
SERVICE_REQUEST_SQS=SERVICE_REQUEST_SQS_PATH_URL
SERVICE_REQUEST_APPROVED_SQS=SERVICE_REQUEST_APPROVED_SQS_PATH_URL
AWS_ACCESS_KEY_ID=ACCESS_KEY
AWS_SECRET_ACCESS_KEY=SECRET_KEY
AWS_REGION=REGION
AWS_ENDPOINT=ENDPOINT
```
Build The docker Image
```
docker build -t email-service:latest .
```

Run the docker Image:
```
docker compose up
```

Sending ServiceApproved message 
```
aws --endpoint-url=<AWS_ENDPOINT> sqs send-message --queue-url <SERVICE_REQUEST_APPROVED_SQS> --message-body '{"message":"hey the user X approved yout request for the service X"}'
```
Sending Service Request message
```
aws --endpoint-url=<AWS_ENDPOINT> sqs send-message --queue-url <SERVICE_REQUEST_SQS> --message-body '{"message":"hey the user X approved yout request for the service X"}'
```


NOTE: The project is meant to be used with localStack and hence the docker-compose.yml is configured with details of localStack.