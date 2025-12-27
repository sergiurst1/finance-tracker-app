import { ResponseType } from "@/types";
import axios from "axios";

const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        const cloudUrl = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_URL;

export const uploadFileToCloudinary = async (
    file: {uri?: string} | string,
    folderName: string
): Promise<ResponseType> => {
    try {

        if(typeof file === 'string'){
            return {success: true, data: file};
        }

        if(!cloudUrl){
            return {success: false, data: null};
        }

        if(file && file.uri){
            const formData = new FormData();
            formData.append('file', {
                uri: file?.uri,
                type: 'image/jpeg',
                name: file?.uri.split('/').pop() || 'file.jpg'
            } as any);
            formData.append('upload_preset', uploadPreset || '');
            formData.append('folder', folderName);

            const response = await axios.post(cloudUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            return {success: true, data: response?.data?.secure_url};
        }

        return {success: true, data: null};
    } catch (error: any) {
        console.log("Cloudinary Upload Error: ", error);
        throw {success: false, msg: "Failed to upload image"};
    }
}

export const getProfileImage= (file: any) => {
    if (file && typeof file === 'string') return file;
    if (file && typeof file === 'object' && 'uri' in file) return file.uri;

    return require('../assets/images/defaultAvatar.png');
};