import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const createUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;

    // Basic Validation
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data" };
    }

    if (id) {
      // TODO: logic for updating existing transaction
    } else {
      // Logic for new transaction
      // 1. Update wallet balance and totals
      const res = await updateWalletForNewTransaction(
        walletId,
        Number(amount),
        type
      );
      if (!res.success) return res;

      // 2. Upload receipt image if exists
      if (image) {
        const imageUploadRes = await uploadFileToCloudinary(
          image,
          "transactions"
        );
        if (!imageUploadRes.success) {
          return { success: false, msg: "Failed to upload receipt" };
        }
        transactionData.image = imageUploadRes.data;
      }

      // 3. Create transaction document in Firestore
      const transactionRef = id
      ? doc(firestore, "transactions", id) 
      : doc(collection(firestore, "transactions"));
      
      await setDoc(transactionRef, transactionData, { merge: true });

      return {
        success: true,
        data: { ...transactionData, id: transactionRef.id },
      };
    }

    return { success: true };
  } catch (err: any) {
    console.log("Error creating or updating transaction: ", err);
    return { success: false, msg: err.message };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);

    if (!walletSnapshot.exists()) {
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    // Check balance for expenses
    if (type === "expense" && Number(walletData.amount) - amount < 0) {
      return { success: false, msg: "Selected wallet doesn't have enough balance" };
    }

    // Prepare updated properties
    const updateType = type === "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type === "income" 
      ? Number(walletData.amount) + amount 
      : Number(walletData.amount) - amount;

    const updatedTotals = Number(walletData[updateType]) + amount;

    // Update wallet document
    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
    });

    return { success: true };
  } catch (err: any) {
    console.log("Error updating wallet for new transaction: ", err);
    return { success: false, msg: err.message };
  }
};