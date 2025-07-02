// context/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Optional loading state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        // const checkAuth = async () => {
        //     const token = localStorage.getItem('token');

        //     if (token) {
        //         try {
        //             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}verifyToken`, {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     "Authorization": token
        //                 },
        //                 body: JSON.stringify({ userID: localStorage.getItem("userID") })

        //             });

        //             const data = await res.json();
        //             if (data.success) {
        //                 setUserToken(token);
        //                 setIsAuthenticated(true);
        //             } else {
        //                 localStorage.removeItem('token');
        //                 setIsAuthenticated(false);
        //             }
        //         } catch (err) {
        //             localStorage.removeItem('token');
        //             setIsAuthenticated(false);
        //         }
        //     }

        //     setIsLoading(false);
        // };
        const tokenExists = document.cookie.split('; ').find(row => row.startsWith('ResumeToken='));
        console.log(tokenExists?.split("ResumeToken=")[1])
        if (tokenExists?.split("ResumeToken=")[1]) {
            setIsAuthenticated(true)
        }
        // checkAuth();
    }, []);
    return (
        <AuthContext.Provider value={{ userToken, isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
