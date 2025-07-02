// 'use client'; // For Next.js App Router (important for client-side interactivity)

import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import cookie from 'cookie';


export async function getServerSideProps(context) {

    const { req } = context;
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.ResumeToken;

    console.log(token, "token")
    if (token) {
        return {
            redirect: {
                destination: '/',
            }
        }
    } else {
        return {
            props: {}
        };
    }
}

const Login = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: "", password: "" })
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async () => {
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        })
        let data = await res.json()
        console.log(data)
        if (data?.userID) {
            document.cookie = `ResumeToken=${data.token}; path=/; max-age=86400`; // 1 day
            router.push("/")
        }
        alert(data?.msg)

    }

    return (
        <div>
            <Navbar />
            <div style={{
                width: '300px',
                margin: '100px auto',
                padding: '30px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif'
            }}>
                <h2 style={{ marginBottom: '20px' }}>Login</h2>
                <input
                    onChange={(e) => handleChange(e)}
                    name="email"
                    placeholder="Email"
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />
                <input
                    onChange={(e) => handleChange(e)}
                    name="password"
                    type="password"
                    placeholder="Password"
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '20px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />
                <button
                    onClick={(e) => handleSubmit(e)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Login
                </button>
            </div>

        </div>
    )
}

export default Login