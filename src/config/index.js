
import S3 from 'react-aws-s3';
import { S3Client, AbortMultipartUploadCommand,ListObjectsCommand } from "@aws-sdk/client-s3";

const config = {
    bucketName: 'muscipuzzlesongs',
    region: 'us-east-1',
    accessKeyId: 'AKIAX2URV73G3G2BSY52',
    secretAccessKey: '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',
    s3Url: 'https://muscipuzzlesongs.s3.us-east-1.amazonaws.com/'
}
export const ReactS3Client = new S3(config);
export const S3ClientObj = new S3Client({ region: 'us-east-1',credentials:{  accessKeyId: 'AKIAX2URV73G3G2BSY52',
        secretAccessKey: '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' } });

// export const client = s3.createClient({
//     maxAsyncS3: 20,     // this is the default
//     s3RetryCount: 3,    // this is the default
//     s3RetryDelay: 1000, // this is the default
//     multipartUploadThreshold: 20971520, // this is the default (20 MB)
//     multipartUploadSize: 15728640, // this is the default (15 MB)
//     s3Options: {
//         accessKeyId: 'AKIAX2URV73G3G2BSY52',
//         secretAccessKey: "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",
//         // any other options are passed to new AWS.S3()
//         // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
//     },
// });
export const ListObjects = ListObjectsCommand;
