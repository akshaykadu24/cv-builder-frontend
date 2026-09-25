import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { TEMPLATES } from '@/components/templates/registry';
import { Box, Button, Chip, Container, Paper, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';

/** Filled-in sample so each preview shows a realistic shape, not empty sections. */
const sampleData = {
    basicDetails: {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        address: "123 Main St",
        city: "City",
        state: "State",
        pincode: "123456",
        intro: "Full stack developer with a focus on React and Node.",
        image: "/profile-placeholder.svg"
    },
    education: [
        { degree: "B.E. Computer Science", institution: "State University", percentage: "78", startYear: "2016", endYear: "2020", location: "City" },
    ],
    experience: [
        { organization: "Acme Corp", joiningLocation: "City", position: "Senior Developer", CTC: "12 LPA", joiningDate: "2022", leavingDate: "", technologies: "React, Node, AWS" },
        { organization: "Globex", joiningLocation: "City", position: "Developer", CTC: "8 LPA", joiningDate: "2020", leavingDate: "2022", technologies: "Vue, Express" },
    ],
    project: [
        { title: "Resume Builder", teamSize: "3", duration: "6 months", technologies: "Next.js, MUI", description: "Template driven CV builder with PDF export." },
    ],
    skill: [
        { skillName: "React", level: "90" },
        { skillName: "Node.js", level: "80" },
        { skillName: "AWS", level: "65" },
    ],
    socialProfile: [
        { platform: "GitHub", url: "github.com/johndoe" },
    ],
};

/* Templates render on a stable 800px canvas. ResizeObserver calculates the
   exact scale needed to fill each card, so there is no unused side padding. */
const PREVIEW_WIDTH = 800;
const PREVIEW_HEIGHT = 460;

const TemplatePreview = ({ Component }) => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(0.38);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateScale = () => {
            const nextScale = Math.min(container.clientWidth / PREVIEW_WIDTH, 1);
            setScale(nextScale);
        };

        updateScale();
        const observer = new ResizeObserver(updateScale);
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    return (
        <Box ref={containerRef} sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: PREVIEW_WIDTH,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                    /* Gallery-only override: template roots have 10px auto margins and
                       different max widths for the editor/PDF. Remove those only in
                       this preview so the scaled page fills the card exactly. */
                    '& > div': {
                        width: '100% !important',
                        maxWidth: 'none !important',
                        margin: '0 !important',
                    },
                }}
            >
                <Component
                    data={{
                        ...sampleData,
                        fontConfig: { minHeight: `${PREVIEW_HEIGHT / scale}px` },
                    }}
                />
            </Box>
        </Box>
    );
};

const Layout = () => {
    const router = useRouter();

    const handleTemplateSelect = (value) => {
        router.push(`/editor?template=${value}`);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
            <Navbar />

            <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
                <Stack spacing={1} alignItems="center" sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <DashboardCustomizeOutlinedIcon color="primary" />
                        <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: 24, sm: 30, md: 34 } }}>
                            Choose a Resume Template
                        </Typography>
                    </Stack>
                    <Typography color="text.secondary" sx={{ fontSize: { xs: 14, md: 16 } }}>
                        Pick a starting point. You can switch templates at any time from the editor.
                    </Typography>
                    <Chip size="small" label={`${TEMPLATES.length} templates`} color="primary" variant="outlined" />
                </Stack>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'repeat(2, minmax(0, 1fr))',
                            xl: 'repeat(3, minmax(0, 1fr))',
                        },
                        gap: { xs: 2.5, md: 3 },
                    }}
                >
                    {TEMPLATES.map(({ value, label, description, Component }) => (
                        <Paper
                            key={value}
                            onClick={() => handleTemplateSelect(value)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleTemplateSelect(value);
                                }
                            }}
                            sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'box-shadow .3s ease, transform .3s ease, border-color .3s ease',
                                boxShadow: '0 1px 2px rgba(16,24,40,.06), 0 10px 24px -14px rgba(16,24,40,.14)',
                                '&:hover, &:focus-visible': {
                                    borderColor: 'primary.main',
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 1px 2px rgba(16,24,40,.06), 0 20px 40px -12px rgba(25,118,210,.28)',
                                },
                                '&:hover .previewOverlay, &:focus-visible .previewOverlay': { opacity: 1 },
                            }}
                        >
                            {/* Scaled preview window */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: PREVIEW_HEIGHT,
                                    overflow: 'hidden',
                                    bgcolor: 'grey.200',
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <TemplatePreview Component={Component} />

                                <Box
                                    className="previewOverlay"
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        pb: 2,
                                        opacity: 0,
                                        transition: 'opacity .3s ease',
                                        background: 'linear-gradient(to top, rgba(15,23,42,.72), transparent 55%)',
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Use this template
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{ p: 2 }}>
                                <Typography fontWeight={700}>{label}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {description}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default Layout;
