import AWS from "aws-sdk";
import toast from "react-hot-toast";

export default async function uploadVideo(
  file: Blob | undefined,
  fileName: string,
) {
  if (!file) {
    toast.error("에러가 발생해서 녹화 영상 업로드에 실패했습니다.");
    return null;
  }

  const s3 = new AWS.S3({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
  });

  const params = {
    Bucket: "debate-ducks-video",
    Key: fileName,
    Body: file,
    ContentEncoding: "base64",
    ContentType: "video/webm",
  };

  try {
    const result = await s3.upload(params).promise();
    if (result.Location) {
      return result.Location;
    }
  } catch (_) {
    toast.error("에러가 발생해서 녹화 영상 업로드에 실패했습니다.");
  }

  return null;
}
