import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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

        if (transactionData.image === undefined) {
            transactionData.image = null;
        }

        if (id) {
            const oldtransactionSnapshot = await getDoc(doc(firestore, "transactions", id));
            const oldTransaction = oldtransactionSnapshot.data() as TransactionType;

            const shouldRevertOriginal =
                oldTransaction.type != type ||
                oldTransaction.amount != Number(amount) ||
                oldTransaction.walletId != walletId;

            if (shouldRevertOriginal) {
                let res = await revertAndUpdateWallets(
                    oldTransaction,
                    Number(amount),
                    type,
                    walletId
                );
                if (!res.success) return res;
            }

            await setDoc(doc(firestore, "transactions", id), transactionData, { merge: true });
            return { success: true, data: transactionData };
        } else {
            const res = await updateWalletForNewTransaction(
                walletId,
                Number(amount),
                type
            );
            if (!res.success) return res;

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

            const transactionRef = id
                ? doc(firestore, "transactions", id)
                : doc(collection(firestore, "transactions"));

            await setDoc(transactionRef, transactionData, { merge: true });

            return {
                success: true,
                data: { ...transactionData, id: transactionRef.id },
            };
        }
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

const revertAndUpdateWallets = async (
    oldTransaction: TransactionType,
    newAmount: number,
    newType: string,
    newWalletId: string
): Promise<ResponseType> => {
    try {
        // 1. Revert original wallet changes
        const oldWalletRef = doc(firestore, "wallets", oldTransaction.walletId);
        const oldWalletSnap = await getDoc(oldWalletRef);
        const oldWallet = oldWalletSnap.data() as WalletType;

        const revertType = oldTransaction.type === "income" ? "totalIncome" : "totalExpenses";
        const revertedWalletAmount =
            oldTransaction.type === "income"
                ? Number(oldWallet.amount) - oldTransaction.amount
                : Number(oldWallet.amount) + oldTransaction.amount;

        await updateDoc(oldWalletRef, {
            amount: revertedWalletAmount,
            [revertType]: Number(oldWallet[revertType]) - oldTransaction.amount,
        });

        // 2. Apply new changes to the (potentially new) wallet
        return await updateWalletForNewTransaction(newWalletId, newAmount, newType);
    } catch (err: any) {
        return { success: false, msg: err.message };
    }
};

export const deleteTransaction = async (
    transactionId: string,
    walletId: string
): Promise<ResponseType> => {
    try {
        const transactionRef = doc(firestore, "transactions", transactionId);
        const transactionSnapshot = await getDoc(transactionRef);
        if (!transactionSnapshot.exists()) return { success: false, msg: "Transaction not found" };

        const transactionData = transactionSnapshot.data() as TransactionType;

        // Fetch wallet to update balance
        const walletRef = doc(firestore, "wallets", walletId);
        const walletSnap = await getDoc(walletRef);
        const walletData = walletSnap.data() as WalletType;

        const updateType = transactionData.type === "income" ? "totalIncome" : "totalExpenses";
        const updatedWalletAmount =
            transactionData.type === "income"
                ? Number(walletData.amount) - transactionData.amount
                : Number(walletData.amount) + transactionData.amount;

        // Validation: Don't allow deletion if it results in negative balance
        if (transactionData.type === "income" && updatedWalletAmount < 0) {
            return { success: false, msg: "You cannot delete this transaction" };
        }

        await updateDoc(walletRef, {
            amount: updatedWalletAmount,
            [updateType]: Number(walletData[updateType]) - transactionData.amount,
        });

        await deleteDoc(transactionRef);
        return { success: true };
    } catch (err: any) {
        return { success: false, msg: err.message };
    }
};