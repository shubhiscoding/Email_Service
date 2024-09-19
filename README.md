# TG_Bot
Running The Bot:

create a .env file with the following details:
```
EMAIL_SERVICE_SQS=EMAIL_SERVICE_SQS_PATH_URL
AWS_ACCESS_KEY_ID=ACCESS_KEY
AWS_SECRET_ACCESS_KEY=SECRET_KEY
AWS_REGION=REGION
AWS_ENDPOINT=ENDPOINT
WEBSITE_URL=Video_Url
SENDER_EMAIL=exampel@gmail.com
```
Build The docker Image
```
docker build -t email-service:latest .
```

Run the docker Image:
```
docker compose up
```

### Expected SQS Message formats:
- [Service Request Created](https://github.com/shubhiscoding/Email_Service/blob/main/RequestCreated.json)
- [Service Request Approved](https://github.com/shubhiscoding/Email_Service/blob/main/RequestApproved.json)
- [Service Request Completed](https://github.com/shubhiscoding/Email_Service/blob/main/ServiceCompleted.json)

NOTE: The project is meant to be used with localStack and hence the docker-compose.yml is configured with details of localStack.

## Email Templates

In the server.js you can find the actual implementation of this at this [switch case](https://github.com/shubhiscoding/Email_Service/blob/9ed34f11d88042f766e7cecb2eccea71fd451fb5/server.js#L123)

### 1. New Service Request
- **Subject**: "New Service Request Posted"
- **Template**: [`new-service-request`](https://github.com/shubhiscoding/Email_Service/blob/main/templates/new-service-request.hbs)
- **Data Object**:
    ```json
    {
        "username": "string",
        "viewServiceLink": "string"
    }
    ```

### 2. Service Request Approved
- **Subject**: "Your Service Request Has Been Approved!"
- **Template**: [`service-request-approved`](https://github.com/shubhiscoding/Email_Service/blob/main/templates/service-request-approved.hbs)
- **Data Object**:
    ```json
    {
        "username": "string",
        "serviceTitle": "string",
        "viewServiceLink": "string"
    }
    ```

### 3. Service Request Completed
- **Subject**: "Service Request Completed - Time to Withdraw Your Earnings!"
- **Template**: [`service-request-completed`](https://github.com/shubhiscoding/Email_Service/blob/main/templates/service-request-completed.hbs)
- **Data Object**:
    ```json
    {
        "username": "string", 
        "serviceTitle": "string",
        "viewServiceLink": "string"
    }
    ```