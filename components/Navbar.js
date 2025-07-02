import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

const Navbar = () => {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Read token from cookies on client side only
        const tokenExists = document.cookie
            .split('; ')
            .find(row => row.startsWith('ResumeToken='));
        console.log(tokenExists)
        setIsAuthenticated(!!tokenExists);
        setIsLoading(false);
    }, []);

    const handleClick = (path) => {
        if (path == "/logout") {
            document.cookie = "ResumeToken=; path=/; max-age=0";
            setIsAuthenticated(false);
            router.push("/login")
        } else {
            router.push(path)

        }
    }

    if (isLoading) return null;

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",   // space between brand and menu
                alignItems: "center",               // vertical center alignment
                padding: "10px 20px",               // some padding around
                backgroundColor: "#282c34",         // dark background
                color: "white",                     // white text
                fontFamily: "Arial, sans-serif",
                margin: "10px"
            }}
        >
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>Resume Builder</div>

            <div style={{ display: "flex", gap: "20px" }}>
                {isAuthenticated ? (
                    <>
                        <div onClick={() => handleClick("/")} style={{ cursor: "pointer" }}>Dashboard</div>
                        <div onClick={() => handleClick("/logout")} style={{ cursor: "pointer" }}>Log Out</div>
                    </>
                ) : (
                    <>
                        <div onClick={() => handleClick("/login")} style={{ cursor: "pointer" }} >Log In</div>
                        <div onClick={() => handleClick("/register")} style={{ cursor: "pointer" }}>Sign Up</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
