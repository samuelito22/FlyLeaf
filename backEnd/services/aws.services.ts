import sharp from "sharp";
import { s3 } from "../config/awsConfig";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

const addUserPicturesToS3 = async (files: any, userId: string) => {
  let pictureNames: string[] = [];

  if (files) {
    for (const [index, file] of files.entries()) {
      const fileType = file.mimetype;  

      if (!allowedMimeTypes.includes(fileType)) {
        throw new Error(`Unsupported MIME type: ${fileType}`);
      }

      const compressedBuffer = await sharp(file.buffer)
         .rotate()
        .resize({ width: 800 }) 
        .jpeg({ quality: 100 }) 
        .toBuffer();


      const fileExtension = fileType.split('/')[1]; 
      const s3Key = `${userId}/picture-${index}.${fileExtension}`;

      const params = {
        Bucket: 'flyleaf-pictures',
        Key: s3Key,
        Body: compressedBuffer,  
        ContentType: fileType  
      };

      try {
        await s3.upload(params).promise();
        pictureNames.push(s3Key);
      } catch (error) {
        console.error('Error uploading to S3:', error);
      }
    }
  }
  return pictureNames;
};

const addUserPictureToS3 = async (file: any, userId: string) => {
  let pictureName = '';

  if (file) {
    const fileType = file.mimetype;

    if (!allowedMimeTypes.includes(fileType)) {
      throw new Error(`Unsupported MIME type: ${fileType}`);
    }

    const compressedBuffer = await sharp(file.buffer)
      .rotate()
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toBuffer();

    const fileExtension = fileType.split('/')[1];
    const s3Key = `${userId}/${file.fieldname}.${fileExtension}`;

    const params = {
      Bucket: 'flyleaf-pictures',
      Key: s3Key,
      Body: compressedBuffer,
      ContentType: fileType
    };

    try {
      await s3.upload(params).promise();
      pictureName = s3Key;
    } catch (error) {
      console.error('Error uploading to S3:', error);
    }
  }
  return pictureName;
};
  
  const getUserPicturesFromS3 = async (pictureNames: string[]) => {
    const pictureUrls: string[] = [];
    
    for (const pictureName of pictureNames) {
      const params = {
        Bucket: 'flyleaf-pictures',
        Key: pictureName,
        Expires: 10800,
      };
      
      try {
        // Using the synchronous method to get the signed URL
        const url = s3.getSignedUrl('getObject', params);
  
        
        pictureUrls.push(url);
      } catch (error:any) {
        throw new Error(error.message)
      }
    }
    
    return pictureUrls;
  };
  

  const deleteUserFolderFromS3 = async (userId: string) => {
    const params = {
      Bucket: 'flyleaf-pictures',
      Prefix: `${userId}/`, // Ending with '/' makes it specific to the folder
    };
  
    try {
      const listedObjects = await s3.listObjectsV2(params).promise();
  
      if(listedObjects && listedObjects.Contents){

      
      if (listedObjects.Contents.length === 0) return;
  
   
      const deleteParams: { Delete: { Objects: Array<{ Key: string }> } , Bucket: string} = {
        Delete: { Objects: [] },
        Bucket: 'flyleaf-pictures',

      };
      
  
      listedObjects.Contents.forEach((obj: any) => {
        const { Key } = obj as { Key: string };
        if (Key) {
          deleteParams.Delete.Objects.push({ Key });
        }
      });
      
      
  
      await s3.deleteObjects(deleteParams).promise();
  
      if (listedObjects.IsTruncated) await deleteUserFolderFromS3(userId);
    }
  
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };
  
  const deleteUserFileFromS3 = async ( fileName: string) => {
    const params = {
      Bucket: 'flyleaf-pictures',
      Key: fileName
    };
  
    try {
      await s3.deleteObject(params).promise();
    } catch (error: any) {
      throw new Error(error.message)
    }
  };

  const awsServices = { addUserPicturesToS3, getUserPicturesFromS3, deleteUserFolderFromS3, addUserPictureToS3, deleteUserFileFromS3}
export default awsServices