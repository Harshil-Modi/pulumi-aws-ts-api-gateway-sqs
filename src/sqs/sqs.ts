import * as aws from "@pulumi/aws";

export const createSqs = ({ queueName }: { queueName: string }) => {
  const sqs = new aws.sqs.Queue(queueName, {
    name: queueName,
  });

  return sqs;
};
