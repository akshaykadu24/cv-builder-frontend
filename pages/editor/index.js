import Navbar from '@/components/Navbar'
import ResumeForm from '@/components/ResumeForm'
import { TEMPLATE_OPTIONS, TEMPLATES, getTemplateComponent } from '@/components/templates/registry'
import VerifyCookies from '@/components/VerifyCookies'
import TemplateSelect from '@/components/TemplateSelect'
import {
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Paper,
    Stack,
    Typography,
} from '@mui/material'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import ViewCarouselOutlinedIcon from '@mui/icons-material/ViewCarouselOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { parse } from 'cookie';
import handleDownload from '@/components/DownloadPDF'


export async function getServerSideProps(context) {
    const { query, req } = context

    const cookies = parse(req.headers.cookie || '');
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
                headingAlign: 'left',
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

    useEffect(() => {


        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);


    }, []);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
            <Navbar />

            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
                {/* Toolbar: title on the left, template + download on the right */}
                <Paper
                    sx={{
                        p: { xs: 2, md: 2.5 },
                        borderRadius: 3,
                        boxShadow: '0 1px 2px rgba(16,24,40,.06), 0 10px 24px -12px rgba(16,24,40,.14)',
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        alignItems={{ xs: 'stretch', md: 'center' }}
                        justifyContent="space-between"
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                            <EditNoteOutlinedIcon color="primary" sx={{ fontSize: 30 }} />
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="h6" fontWeight={700} noWrap sx={{ fontSize: { xs: 18, md: 21 } }}>
                                    Resume Editor
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Every change shows up in the preview instantly
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1.5}
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                        >
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={1.25}
                                alignItems={{ xs: 'stretch', sm: 'center' }}
                                sx={{
                                    p: 1,
                                    borderRadius: 2.5,
                                    border: '1px solid',
                                    borderColor: 'primary.light',
                                    bgcolor: 'rgba(25,118,210,.05)',
                                }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 0.5 }}>
                                    <ViewCarouselOutlinedIcon color="primary" />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>
                                            Try another design
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
                                            Your content stays the same
                                        </Typography>
                                    </Box>
                                </Stack>

                                <TemplateSelect
                                    label="Change template"
                                    value={formData?.template}
                                    options={TEMPLATE_OPTIONS}
                                    onChange={(value) => handleSelect({ target: { value } })}
                                />
                            </Stack>

                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<DownloadOutlinedIcon />}
                                onClick={() => handleDownloadClick(formData?.resumeName)}
                                sx={{
                                    borderRadius: 2,
                                    px: 2.5,
                                    py: 1,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 4px 12px rgba(46,125,50,.32)',
                                    transition: 'box-shadow .2s ease, transform .2s ease',
                                    '&:hover': {
                                        boxShadow: '0 8px 20px rgba(46,125,50,.42)',
                                        transform: 'translateY(-1px)',
                                    },
                                    '&:active': { transform: 'translateY(0)' },
                                }}
                            >
                                Download Resume
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>

                {/* minmax(0,1fr) stops the 700px preview from widening its column */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) minmax(0,1fr)' },
                        gap: { xs: 2, md: 3 },
                        alignItems: 'start',
                        mt: { xs: 2, md: 3 },
                    }}
                >
                    <Paper
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: '0 1px 2px rgba(16,24,40,.06), 0 10px 24px -12px rgba(16,24,40,.14)',
                        }}
                    >
                        <ResumeForm
                            formData={formData}
                            setFormData={setFormData}
                            formError={formError}
                            setFormError={setFormError}
                        />
                    </Paper>

                    <Paper
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: '0 1px 2px rgba(16,24,40,.06), 0 10px 24px -12px rgba(16,24,40,.14)',
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ px: 2, py: 1.5 }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <VisibilityOutlinedIcon fontSize="small" color="primary" />
                                <Typography variant="subtitle2" fontWeight={700}>
                                    Live Preview
                                </Typography>
                            </Stack>
                            <Chip
                                size="small"
                                color="primary"
                                variant="outlined"
                                label={TEMPLATES.find((t) => t.value === formData?.template)?.label || 'Classic'}
                            />
                        </Stack>
                        <Divider />

                        <Box
                            sx={{
                                p: { xs: 1, sm: 2 },
                                bgcolor: 'grey.50',
                                display: 'flex',
                                justifyContent: 'center',
                                overflowX: 'auto',
                            }}
                        >
                            {/* Captured by html2canvas - styles here end up in the PDF, leave as is */}
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
                                {(() => {
                                    // Unknown values fall back to Classic, as the old ternary did
                                    const ActiveTemplate = getTemplateComponent(formData.template)
                                    return <ActiveTemplate data={formData} />
                                })()}
                            </div>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    )
}

export default Editor
