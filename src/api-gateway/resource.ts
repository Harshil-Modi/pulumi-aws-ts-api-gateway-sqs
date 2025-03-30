import * as aws from "@pulumi/aws";
import { RestApi } from "@pulumi/aws/apigateway";
import * as pulumi from "@pulumi/pulumi";

export const createRestApiResource = ({
  api,
  resourceName,
  method,
  path,
  integrationMethod,
  integrationType,
  integrationUri,
  integrationRoleArn,
  integrationRequestTemplates,
  integrationRequestHeader,
  authorization,
  authorizerId,
}: {
  api: RestApi;
  resourceName: string;
  method: string;
  path: string;
  integrationMethod: string;
  integrationType: "AWS" | "AWS_PROXY" | "HTTP" | "HTTP_PROXY";
  integrationUri: pulumi.Output<string>;
  integrationRequestTemplates?: { [key: string]: string };
  integrationRequestHeader?: { [key: string]: string };
} & (
  | { authorization: "NONE" | "AWS_IAM"; authorizerId: undefined }
  | { authorization: "CUSTOM" | "COGNITO_USER_POOLS"; authorizerId: string }
) & {
    integrationType: "AWS";
    integrationRoleArn: pulumi.Output<string>;
  }) => {
  // Get api id from the rest api
  const restApiId = api.id;

  // Create path resource
  const resource = new aws.apigateway.Resource(resourceName, {
    restApi: restApiId,
    parentId: api.rootResourceId,
    pathPart: path,
  });

  // Create method
  const httpMethod = new aws.apigateway.Method(`${resourceName}Method`, {
    httpMethod: method,
    authorization,
    authorizerId,
    restApi: restApiId,
    resourceId: resource.id,
  });

  // Create method response
  const httpMethodResponse = new aws.apigateway.MethodResponse(
    `${resourceName}MethodResponse`,
    {
      httpMethod: httpMethod.httpMethod,
      restApi: restApiId,
      resourceId: resource.id,
      statusCode: "200",
      responseModels: {
        "application/json": "Empty",
      },
    }
  );

  // Create integration
  const integration = new aws.apigateway.Integration(
    `${resourceName}Integration`,
    {
      httpMethod: httpMethod.httpMethod,
      integrationHttpMethod: integrationMethod,
      restApi: restApiId,
      resourceId: resource.id,
      type: integrationType,
      uri: integrationUri,
      credentials: integrationRoleArn,
      requestTemplates: integrationRequestTemplates,
      requestParameters: integrationRequestHeader,
      cacheKeyParameters: Object.keys(integrationRequestHeader || {}),
    }
  );

  // Create integration response
  const integrationResponse = new aws.apigateway.IntegrationResponse(
    `${resourceName}IntegrationResponse`,
    {
      restApi: restApiId,
      resourceId: resource.id,
      httpMethod: integration.httpMethod,
      statusCode: "200",
      responseTemplates: {
        "application/json": "",
      },
    }
  );

  return {
    resource,
    httpMethod,
    httpMethodResponse,
    integration,
    integrationResponse,
  };
};
