import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setRole(userData.role);
                    setUserDetails({
                        ...userData,
                        photoURL: userData.photoURL || 'https://via.placeholder.com/100'
                    });
                } else {
                    setRole(null);
                    setUserDetails(null);
                }
            } else {
                setUser(null);
                setRole(null);
                setUserDetails(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateUserDetails = async () => {
        if (user) {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setUserDetails({
                    ...userData,
                    photoURL: userData.photoURL || 'https://via.placeholder.com/100'
                });
            }
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setRole(null);
            setUserDetails(null);
            return true;
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            role, 
            setRole, 
            loading, 
            logout,
            userDetails,
            updateUserDetails // Yeni fonksiyonu ekledik
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
