import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageServices";


export const updateUser = async (
    userId: string, 
    updatedData: UserDataType
): Promise<ResponseType> => {
    try {

        if(updatedData.image && updatedData?.image?.uri){
            const imagegUploadRef = await uploadFileToCloudinary(
                updatedData.image,
                "users"
            );

            if(!imagegUploadRef.success){
                return { success: false, msg: "Failed to upload profile image. Try again!" };
            }
            updatedData.image = imagegUploadRef.data as string;
        }
        const userRef = doc(firestore, "users", userId);
        await updateDoc(userRef, updatedData);

        return { success: true, msg: "User data updated successfully" };
    } catch (error: any) {
        let msg = "An error occurred while updating user data. Try again!";
        return { success: false, msg: msg };
    }
};