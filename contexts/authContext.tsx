import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<UserType>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser?.uid,
                    email: firebaseUser?.email,
                    name: firebaseUser?.displayName,
                });
                updateUserData(firebaseUser.uid);
                router.replace("/(tabs)");
            } else {
                setUser(null);
                router.replace("/(auth)/Welcome");
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return {success: true};
        } catch (error: any) {
            let msg = "An error occurred during login. Try again!";
            return {success: false, msg: msg};
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            let response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(firestore, "users", response?.user?.uid), {
                name: name,
                email: email,
                uid: response?.user?.uid,
            });
            return {success: true};
        } catch (error: any) {
             if(error.message.includes("(auth/email-already-in-use)")){
                return {success: false, msg: "Email already in use"};
            }else{
                let msg = "An error occurred during login. Try again!";
                return {success: false, msg: msg};
            }
        }
    };

    const updateUserData = async (userId: string) => {
        try {
            const docRef = doc(firestore, "users", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setUser(docSnap.data() as UserType);
            }
        } catch (error: any) {
            let msg = error.message;
            console.log(msg);
        }
    };

    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};