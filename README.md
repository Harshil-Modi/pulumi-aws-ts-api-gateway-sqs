# AWS Serverless Pattern: API Gateway to SQS

## Overview

This repository provides an AWS serverless pattern using Pulumi and TypeScript to connect Amazon API Gateway to Amazon SQS. This pattern allows you to expose an HTTP API endpoint that sends messages directly to an SQS queue for further processing.

## Architecture

The infrastructure deployed includes:

* **Amazon API Gateway** (HTTP API) to expose a public endpoint.
* **Amazon SQS** (Simple Queue Service) to store messages for asynchronous processing.
* **IAM Roles and Policies** to manage access permissions between API Gateway and SQS.
* **Pulumi** as the Infrastructure-as-Code (IaC) tool to define and deploy resources.

## Prerequisites

To deploy this pattern, ensure you have the following installed:

* [Pulumi CLI](https://www.pulumi.com/docs/install/)
* [NodeJS and npm](https://nodejs.org/)
* [AWS CLI](https://aws.amazon.com/cli/) (configured with appropriate credentials)

## Deployment

1. Clone this repository:

   ```sh
   git clone https://github.com/Harshil-Modi/pulumi-aws-ts-api-gateway-sqs.git
   cd pulumi-aws-ts-api-gateway-sqs
   ```
2. Install dependencies:

   ```sh
   npm install
   ```
3. Set up Pulumi stack:

   ```sh
   pulumi stack init dev  # Change 'dev' to your preferred stack name
   ```
4. Set up deployment configuration:

   ```sh
   pulumi config set aws:region ap-south-1  # Set AWS region
   pulumi config set aws:profile Harshil # Set AWS Profile
   ```

   Alternatively, set profile and region using environment variables while using `pulumi` command. e.g

   ```sh
   AWS_PROFILE=Harshil AWS_REGION=ap-south-1 pulumi up
   ```
5. Deploy the infrastructure:

   ```sh
   pulumi up
   ```

   Confirm the deployment when prompted.
6. Retrieve the API Gateway endpoint:

   ```sh
   pulumi stack output apiUrl
   ```

   Use this URL to send HTTP POST requests to publish messages to the SQS queue.

## Usage

To test the API Gateway integration with SQS, you can send a request using `curl`:

```sh
curl -X POST -H "Content-Type: application/json" -d '{"message": "Hello, SQS!"}' <apiUrl>/sqs
```

You can then check the SQS queue to verify that the message was received.

## Cleanup

To destroy all deployed resources:

```sh
pulumi destroy
```

## References

* [Pulumi AWS Documentation](https://www.pulumi.com/docs/clouds/aws/)
* [Amazon API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
* [Amazon SQS](https://docs.aws.amazon.com/sqs/latest/dg/welcome.html)
