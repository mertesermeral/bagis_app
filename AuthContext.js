import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        try {
            const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
                try {
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
                        }
                    } else {
                        setUser(null);
                        setRole(null);
                        setUserDetails(null);
                    }
                } catch (error) {
                    console.error("Auth state change error:", error);
                } finally {
                    setLoading(false);
                }
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Auth provider error:", error);
            setLoading(false);
        }
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
            // Otomatik login flag'lerini temizle
            await AsyncStorage.removeItem("isLoggedIn");
            await AsyncStorage.removeItem("autoLoginRole");
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
            updateUserDetails, // Yeni fonksiyonu ekledik
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
