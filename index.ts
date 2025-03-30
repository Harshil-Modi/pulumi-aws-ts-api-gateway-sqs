import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import {
  createApiGatewaySqsRole,
  createRestApi,
} from "./src/api-gateway/api-gateway";
import { createRestApiDeployment } from "./src/api-gateway/deployment";
import { createRestApiResource } from "./src/api-gateway/resource";
import { createSqs } from "./src/sqs/sqs";

// Get the current AWS account ID
const callerIdentity = aws.getCallerIdentity();
const accountId = callerIdentity.then((identity) => identity.accountId);

// Get project name and stack name
const project = pulumi.getProject();
const stack = pulumi.getStack();

const generateResourceName = (name: string) => `${project}-${stack}-${name}`;

// Create rest api
const restApi = createRestApi({
  apiName: generateResourceName("restapi"),
});

// Create sqs
const sqs = createSqs({
  queueName: generateResourceName("sqs"),
});

console.log("Role name", generateResourceName("apigw-sqs-role"));

// Create api gateway to sqs role
const apigatewayToSqsRole = createApiGatewaySqsRole({
  name: generateResourceName("apigw-sqs-role"),
  sqsArn: sqs.arn,
});

// Create resource
const resource = createRestApiResource({
  authorization: "NONE",
  integrationMethod: "POST",
  integrationType: "AWS",
  integrationUri: pulumi.interpolate`arn:aws:apigateway:${aws.config.region}:sqs:path/${accountId}/${sqs.name}`,
  method: "POST",
  path: "sqs",
  resourceName: generateResourceName("sqs-endpoint"),
  api: restApi,
  authorizerId: undefined,
  integrationRoleArn: apigatewayToSqsRole.arn,
  integrationRequestHeader: {
    "integration.request.header.Content-Type":
      "'application/x-www-form-urlencoded'",
  },
  integrationRequestTemplates: {
    "application/json": "Action=SendMessage&MessageBody=$input.body",
  },
});

// Create rest api deployment
const restApiDeployment = createRestApiDeployment({
  deploymentName: generateResourceName("restapi-deployment"),
  api: restApi,
  dependsOn: [
    resource.httpMethod,
    resource.integration,
    resource.resource,
    resource.integrationResponse,
    resource.httpMethodResponse,
  ],
});

export const apiUrl = restApi.id;
