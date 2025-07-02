// 'use client'; // For Next.js App Router (important for client-side interactivity)

import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import cookie from 'cookie';
import FieldValidate from '@/components/FieldValidate';


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

const Register = () => {
    const route = useRouter()
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" })
    const [error, setError] = useState({})

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value?.trim() })
    }
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    const handleSubmit = async () => {
        setError(formData)
        if (!formData?.name || !formData?.email || !formData?.password) {
            // alert("Please fill required fields");
            return;
        }
        if (!isValidEmail(formData.email)) {
            // alert("Please enter a valid email address");
            return;
        }
        try {

            let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)

            })
            let data = await res.json()
            console.log(data, "data")
            if (data?.msg == "User Created successfully") {
                setFormData({ name: "", email: "", phone: "", password: "" })
            }
            alert(data?.msg)
            route.push("/login")
        } catch (error) {
            console.log("register failed", error)
        }
    }

    return (
        <div>
            <Navbar />
            <div style={{
                width: '320px',
                margin: '100px auto',
                padding: '30px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif'
            }}>
                <h2 style={{ marginBottom: '20px' }}>Register</h2>

                <input
                    onChange={(e) => handleChange(e)}
                    name="name"
                    value={formData?.name}
                    placeholder="Name*"
                    style={{
                        width: '100%',
                        padding: '10px',
                        // marginBottom: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />
                {/* {error?.name !== undefined && (error?.name?.trim().length > 0 ? null : <div style={{ color: "red", fontSize: "13px", textAlign: 'left' }}>Name field is required</div>)} */}
                <FieldValidate fieldValue={error?.name} fieldName={"Name"} />

                <input
                    onChange={(e) => handleChange(e)}
                    name="email"
                    value={formData?.email}
                    placeholder="Email*"
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />
                {/* {error?.email !== undefined && (error?.email?.trim().length > 0 ? null : <div style={{ color: "red", fontSize: "13px", textAlign: 'left' }}>Email field is required</div>)} */}
                <FieldValidate fieldValue={error?.email} fieldName={"Email"} propFunction={isValidEmail} />

                <input
                    onChange={(e) => handleChange(e)}
                    type='number'
                    name="phone"
                    value={formData?.phone}
                    placeholder="Phone"
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />
                {/* {error?.phone !== undefined && (error?.phone?.trim().length > 0 ? null : <div style={{ color: "red",fontSize:"13px", textAlign: 'left' }}>phone field is required</div>)} */}


                <input
                    onChange={(e) => handleChange(e)}
                    name="password"
                    value={formData?.password}
                    type="password"
                    placeholder="Password*"
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />
                {/* {error?.password !== undefined && (error?.password?.trim().length > 0 ? null : <div style={{ color: "red", fontSize: "13px", textAlign: 'left' }}>Password field is required</div>)} */}
                <FieldValidate fieldValue={error?.password} fieldName={"Password"} />
                <br />

                <button
                    onClick={(e) => handleSubmit(e)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        marginTop: "20px",
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Register
                </button>
            </div>

        </div>
    )
}

export default Register