import { S3 } from "aws-sdk";
const s3 = new S3({
  accessKeyId: "AKIAXYKJQWSEZNY6XHZX",
  secretAccessKey: "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",
});

export async function copyS3Folder(
  sourcePrefix: string,
  destinationPrefix: string,
  continuationToken?: string
): Promise<void> {
  try {
    const listParams = {
      Bucket: "madhav.dev.intervue",
      Prefix: sourcePrefix,
      ContinuationToken: continuationToken,
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;
    await Promise.all(
      listedObjects.Contents.map(async (object) => {
        if (!object.Key) return;
        let destinationKey = object.Key.replace(
          sourcePrefix,
          destinationPrefix
        );
        let copyParams = {
          Bucket: "madhav.dev.intervue",
          CopySource: `madhav.dev.intervue/${object.Key} `,
          Key: destinationKey,
        };
        await s3.copyObject(copyParams).promise();
      })
    );
    if (listedObjects.IsTruncated) {
      listParams.ContinuationToken = listedObjects.NextContinuationToken;
      await copyS3Folder(sourcePrefix, destinationPrefix, continuationToken);
    }
  } catch (error) {
    console.error("Error copying folder:", error);
  }
}

export const saveToS3 = async (
  key: string,
  filePath: string,
  content: string
): Promise<void> => {
  const params = {
    Bucket: "madhav.dev.intervue",
    Key: `${key}${filePath}`,
    Body: content,
  };
  console.log("key", key);
  console.log("filePath", filePath);
  await s3.putObject(params).promise();
};
