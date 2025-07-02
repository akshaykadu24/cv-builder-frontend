import Navbar from '@/components/Navbar'
import ResumeForm from '@/components/ResumeForm'
import ClassicTemplate from '@/components/templates/ClassicTemplate'
import ModernTemplate from '@/components/templates/ModernTemplate'
import SidebarTemplate from '@/components/templates/SidebarTemplate'
import VerifyCookies from '@/components/VerifyCookies'
import { Button, MenuItem, Select, Box, patch } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import cookie from 'cookie';
import handleDownload from '@/components/DownloadPDF'


export async function getServerSideProps(context) {
    const { query, req } = context

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.ResumeToken;
    let result = await VerifyCookies(context)
    if (result?.success) {
        let res
        let singleResumedata
        if (query?.rid) {

            res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}fetchSingleResume?id=${query?.rid}`, {
                method: "GET",
                headers: {
                    "Authorization": token
                }
            })
            singleResumedata = await res.json()
            console.log(singleResumedata, "singleResume")
        }



        return {
            props: {
                user: result?.userID || null,
                data: singleResumedata?.data || {}
            },
        }
    } else {
        return result
    }
}

const Editor = (props) => {
    // const fontConfig = {
    //     nameSize: 32,
    //     introSize: 16,
    //     contactSize: 14,
    //     headingSize: 20,
    //     itemSize: 14,
    //     minHeight: '950px',
    //     bodyFont: 'Arial, sans-serif',
    // }

    const router = useRouter()
    const [isMobile, setIsMobile] = useState(false);
    const [formError, setFormError] = useState({})
    const [formData, setFormData] = useState(
        props?.data[0] || {
            template: router?.query?.template || 'classic',
            resumeName: 'Resume 1',
            basicDetails: {
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
                intro: '',
                image: '',
            },
            education: [
                {
                    degree: '',
                    institution: '',
                    percentage: '',
                    startYear: '',
                    endYear: '',
                    location: '',
                },
            ],
            experience: [
                {
                    organization: '',
                    joiningLocation: '',
                    position: '',
                    CTC: '',
                    joiningDate: '',
                    leavingDate: '',
                    technologies: '',
                },
            ],
            project: [
                {
                    title: '',
                    teamSize: '',
                    duration: '',
                    technologies: '',
                    description: '',
                },
            ],
            skill: [{ skillName: '', level: '' }],
            socialProfile: [{ platform: '', url: '' }],
            fontConfig: {
                nameSize: 32,
                introSize: 16,
                contactSize: 14,
                headingSize: 20,
                itemSize: 14,
                // minHeight: '950px',
                bodyFont: 'Arial, sans-serif',
            }
        })


    const handleSelect = (e) => {
        setFormData((prev) => ({ ...prev, template: e.target.value }))
        router.replace({ pathname: router.pathname, query: { ...router.query, template: e.target.value } }, undefined, { shallow: true });

    }
    let handleDownloadClick = (resumeName) => {
        handleDownload("resume-to-download", resumeName)
    }

    // const handleDownload = () => {
    //     const input = document.getElementById('resume-to-download')
    //     html2canvas(input, { scale: 2 }).then((canvas) => {
    //         const imgData = canvas.toDataURL('image/png')
    //         const pdf = new jsPDF('p', 'mm', 'a4')
    //         const imgProps = pdf.getImageProperties(imgData)
    //         const pdfWidth = pdf.internal.pageSize.getWidth()
    //         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    //         pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    //         pdf.save('resume.pdf')
    //     })
    // }

    useEffect(() => {


        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);


    }, []);

    return (
        <div >
            <Navbar />
            <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Resume Editor</h2>
            <hr />

            <div
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-around",
                    gap: "20px",
                    padding: "20px",
                }}
            >
                <div style={{ width: isMobile ? "100%" : "48%" }}>
                    <ResumeForm formData={formData} setFormData={setFormData} formError={formError} setFormError={setFormError} />
                </div>

                <div
                    style={{
                        width: isMobile ? "100%" : "48%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isMobile ? "center" : "flex-end",
                    }}
                >
                    <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2} gap={2}>
                        <Select
                            onChange={handleSelect}
                            value={formData?.template}
                            size="small"
                            variant="outlined"
                            MenuProps={{ disablePortal: true }}
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="classic">Classic</MenuItem>
                            <MenuItem value="modern">Modern</MenuItem>
                            <MenuItem value="sidebar">Sidebar</MenuItem>
                        </Select>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                backgroundColor: '#2e7d32',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#1b5e20',
                                },
                            }}
                            onClick={() => handleDownloadClick(formData?.resumeName)}
                        >
                            Download Resume
                        </Button>
                    </Box>

                    <div
                        id="resume-to-download"
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            backgroundColor: "#fff",
                            transform: isMobile ? "scale(0.55)" : "scale(1)",
                            transformOrigin: "top",
                            width: isMobile ? "700px" : "100%",
                            // minHeight: '950px'
                        }}
                    >
                        {formData.template === "modern" ? (
                            <ModernTemplate data={formData} />
                        ) : formData.template === "sidebar" ? (
                            <SidebarTemplate data={formData} />
                        ) : (
                            <ClassicTemplate data={formData} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editor
