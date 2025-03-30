import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export const createLambdaFunction = ({
  functionName,
  executionRoleArn,
  code,
  handler,
}: {
  functionName: string;
  executionRoleArn: string;
  handler: string;
  code: pulumi.Input<pulumi.asset.Archive>;
}) => {
  const lambdaFunction = new aws.lambda.Function(functionName, {
    architectures: ["arm64"],
    memorySize: 1024,
    name: functionName,
    runtime: "nodejs22.x",
    handler,
    code,
    role: executionRoleArn,
  });

  return lambdaFunction;
};
