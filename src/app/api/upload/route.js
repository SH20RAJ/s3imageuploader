import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const { file } = await req.json();
    const base64Data = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const type = file.split(';')[0].split('/')[1];

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${Date.now().toString()}.${type}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`,
    };

    const upload = new Upload({
      client: s3Client,
      params: params,
    });

    const data = await upload.done();

    // Generate the URL in the desired format
    const url = `https://s3.amazonaws.com/${params.Bucket}/${params.Key}`;

    return new Response(JSON.stringify({ url: url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
