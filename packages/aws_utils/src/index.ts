import {
  S3Client,
  ListObjectsV2Command,
  CopyObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  credentials: {
    accessKeyId: "AKIAXYKJQWSEZNY6XHZX",
    secretAccessKey: "MtFzwde8tK1G5iXcB2NmPJIMIc32ZjSbULoRnmox",
  },
  region: "your-region", // specify the region here
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

    const listedObjects = await s3.send(new ListObjectsV2Command(listParams));

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

    await Promise.all(
      listedObjects.Contents.map(async (object) => {
        if (!object.Key) return;
        const destinationKey = object.Key.replace(
          sourcePrefix,
          destinationPrefix
        );
        const copyParams = {
          Bucket: "madhav.dev.intervue",
          CopySource: `madhav.dev.intervue/${object.Key}`,
          Key: destinationKey,
        };
        await s3.send(new CopyObjectCommand(copyParams));
      })
    );

    if (listedObjects.IsTruncated) {
      await copyS3Folder(
        sourcePrefix,
        destinationPrefix,
        listedObjects.NextContinuationToken
      );
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
    Bucket: process.env.S3_BUCKET ?? "",
    Key: `${key}${filePath}`,
    Body: content,
  };

  await s3.send(new PutObjectCommand(params));
};
