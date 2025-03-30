import * as aws from "@pulumi/aws";
import { RestApi } from "@pulumi/aws/apigateway";
import * as pulumi from "@pulumi/pulumi";

export const createRestApiDeployment = ({
  deploymentName,
  api,
  dependsOn,
}: {
  deploymentName: string;
  api: RestApi;
  dependsOn: pulumi.Resource[];
}) => {
  const deployment = new aws.apigateway.Deployment(
    deploymentName,
    {
      restApi: api,
      triggers: {
        redeployment: pulumi
          .output(api.id)
          .apply(() => new Date().toISOString()),
      },
    },
    {
      dependsOn: [...dependsOn, api],
    }
  );

  return deployment;
};
