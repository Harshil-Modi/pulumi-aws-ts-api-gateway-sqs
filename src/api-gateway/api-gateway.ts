import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export const createRestApi = ({ apiName }: { apiName: string }) => {
  const api = new aws.apigateway.RestApi(apiName, {
    name: apiName,
  });

  return api;
};

export const createApiGatewaySqsRole = ({
  name,
  sqsArn,
}: {
  name: string;
  sqsArn: pulumi.Output<string>;
}) => {
  // Create IAM role for API Gateway to access SQS
  const role = new aws.iam.Role(name, {
    assumeRolePolicy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Action: "sts:AssumeRole",
          Effect: "Allow",
          Principal: {
            Service: "apigateway.amazonaws.com",
          },
        },
      ],
    }),
  });

  // Attach policy to allow SQS access
  const policy = new aws.iam.RolePolicy(`${name}-policy`, {
    role: role.id,
    policy: sqsArn.apply((arn) =>
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: [
              "sqs:SendMessage",
              "sqs:GetQueueUrl",
              "sqs:GetQueueAttributes",
            ],
            Resource: [arn, `${arn}/*`],
          },
        ],
      })
    ),
  });

  return role;
};
