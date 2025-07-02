import React, { useState } from 'react';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import SidebarTemplate from '@/components/templates/SidebarTemplate';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';

const sampleData = {
    basicDetails: {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        address: "123 Main St",
        city: "City",
        state: "State",
        pincode: "123456",
        intro: "A brief intro goes here.",
        image: ""
    },
    education: [],
    experience: [],
    project: [],
    skill: [],
    socialProfile: []
};

const templates = [
    { name: 'Classic', Component: ClassicTemplate },
    { name: 'Modern', Component: ModernTemplate },
    { name: 'Sidebar', Component: SidebarTemplate }
];

const Layout = () => {
    const router = useRouter();
    const [selected, setSelected] = useState(null); // No selected by default

    const handleTemplateSelect = (layoutName) => {
        setSelected(layoutName);
        router.push(`/editor?template=${layoutName}`);
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30, marginTop: 20 }}>
                    <h2
                        style={{
                            fontSize: '2.2rem',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            color: '#1a1a1a',
                            borderBottom: '2px solid #1976d2',
                            paddingBottom: '8px',
                            margin: 0
                        }}
                    >
                        Choose a Resume Template
                    </h2>
                </div>


                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: 40,
                    }}
                >
                    {templates.map(({ name, Component }) => {
                        const isSelected = selected === name.toLowerCase();

                        return (
                            <div
                                key={name}
                                onClick={() => handleTemplateSelect(name.toLowerCase())}
                                style={{
                                    cursor: 'pointer',
                                    border: isSelected ? '3px solid #1a73e8' : '2px solid #ccc',
                                    borderRadius: 8,
                                    boxShadow: isSelected ? '0 0 15px rgba(26, 115, 232, 0.7)' : '0 0 10px rgba(0,0,0,0.1)',
                                    backgroundColor: 'white',
                                    transform: isSelected ? 'scale(1)' : 'scale(0.8)', // zoom only if selected
                                    transformOrigin: 'top left',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
                                    flex: '0 1 auto',
                                    width: 300,
                                    maxWidth: '100%',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(26, 115, 232, 0.7)';
                                    // e.currentTarget.style.border = '3px solid #1a73e8';
                                }}
                                onMouseLeave={e => {
                                    if (!isSelected) {
                                        e.currentTarget.style.transform = 'scale(0.8)';
                                        e.currentTarget.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.border = '2px solid #ccc';
                                    }
                                }}
                            >
                                <Component data={{ ...sampleData, fontConfig: { minHeight: "500px" } }} />
                            </div>
                        );
                    })}
                </div>

                <style jsx>{`
        @media (max-width: 900px) {
          div[style*="display: flex"] > div {
            width: 90% !important;
            transform: scale(1) !important;
            border: 2px solid #ccc !important;
            box-shadow: 0 0 10px rgba(0,0,0,0.1) !important;
          }
        }
      `}</style>
            </div>
        </div>
    );
};

export default Layout;
