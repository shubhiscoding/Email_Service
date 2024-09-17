const {
    SQSClient,
    ReceiveMessageCommand,
    DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const { SESClient, SendEmailCommand, VerifyEmailAddressCommand } = require("@aws-sdk/client-ses");
const dotenv = require('dotenv');
dotenv.config();

const sesClient = new SESClient({
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Function to verify the email address before sending the email
async function verifyEmail(email) {
    try {
        const command = new VerifyEmailAddressCommand({
            EmailAddress: email,
        });
        const response = await sesClient.send(command);
        console.log("Email verification initiated:", response);
    } catch (error) {
        console.error("Error verifying email:", error);
    }
}

// Function to send the email
async function sendEmail(response, subject) {
    const input = {
        "Destination": {
            "BccAddresses": [],
            "CcAddresses": [
                "recipient3@example.com"
            ],
            "ToAddresses": [
                "recipient1@example.com",
                "recipient2@example.com"
            ]
        },
        "Message": {
            "Body": {
                "Text": {
                    "Data": response.message,
                }
            },
            "Subject": {
                "Data": subject,
            }
        },
        "Source": "thatweb3guyy@gmail.com"
    };
    try {
        const command = new SendEmailCommand(input);
        const response = await sesClient.send(command);
        console.log("Email sent successfully:", response.MessageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

const email_request_queue = process.env.SERVICE_REQUEST_SQS;
const email_approved_queue = process.env.SERVICE_REQUEST_APPROVED_SQS;
const sqsClient = new SQSClient({
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function receiveAndProcessSQSMessage(queue_url, type) {
    try {
        const receiveMessageCommand = new ReceiveMessageCommand({
            QueueUrl: queue_url,
            MaxNumberOfMessages: 1,
        });
        const data = await sqsClient.send(receiveMessageCommand);

        if (data.Messages && data.Messages.length > 0) {
            const message = data.Messages[0];
            console.log("Received message:", message.Body);

            const response = JSON.parse(message.Body);

            // First verify the email address
            await verifyEmail("thatweb3guyy@gmail.com");
            let subject = "Service request approved";
            if(type === "request") {
                subject = "Service request received";
            }
            // Then send the email
            await sendEmail(response, subject);

            // Delete the message from SQS after processing
            const deleteMessageCommand = new DeleteMessageCommand({
                QueueUrl: queue_url,
                ReceiptHandle: message.ReceiptHandle,
            });
            await sqsClient.send(deleteMessageCommand);
            console.log("Message deleted from SQS.");
        }
    } catch (error) {
        console.error("Error receiving or processing message from SQS:", error);
    }
}

function pollMessages() {
    setInterval(() => {
        receiveAndProcessSQSMessage(email_request_queue, "request");
        receiveAndProcessSQSMessage(email_approved_queue, "approved");
    }, 5000);
}
pollMessages();
