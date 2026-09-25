import React from 'react';
import Navbar from '@/components/Navbar';
import { Box, Paper, Stack, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Logo from '@/components/Logo';
import { AUTH_HIGHLIGHTS, brandSx, cardSx } from '@/components/authStyles';

/**
 * Shared layout for the login and register screens: navbar, centered card,
 * gradient brand panel, and a form panel rendered from `children`.
 *
 * The gradient panel is a side column on desktop and collapses into a
 * compact banner above the form on mobile.
 */
const AuthShell = ({
    brandTitle,
    brandSubtitle,
    formTitle,
    formSubtitle,
    onSubmit,
    highlights = AUTH_HIGHLIGHTS,
    children,
}) => (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
        <Navbar />

        <Box
            sx={{
                display: 'grid',
                placeItems: 'center',
                px: { xs: 1.5, sm: 3 },
                py: { xs: 2, sm: 4, md: 7 },
            }}
        >
            <Paper sx={cardSx}>
                <Stack spacing={{ xs: 1, md: 3 }} justifyContent="center" sx={brandSx}>
                    <Box sx={{ position: 'relative', textAlign: { xs: 'center', md: 'left' } }}>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent={{ xs: 'center', md: 'flex-start' }}
                            sx={{ mb: 1 }}
                        >
                            <Logo size={38} variant="light" />
                            <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.9 }}>
                                Resume Builder
                            </Typography>
                        </Stack>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{ fontSize: { xs: 24, sm: 28, md: 34 }, textShadow: '0 2px 12px rgba(0,0,0,.18)' }}
                        >
                            {brandTitle}
                        </Typography>
                        <Typography sx={{ mt: 1, opacity: 0.9, fontSize: { xs: 14, md: 16 } }}>
                            {brandSubtitle}
                        </Typography>
                    </Box>

                    {/* Feature list adds height, so desktop only */}
                    <Stack spacing={1.5} sx={{ position: 'relative', display: { xs: 'none', md: 'flex' } }}>
                        {highlights.map((item) => (
                            <Stack key={item} direction="row" spacing={1.5}>
                                <CheckCircleOutlineIcon fontSize="small" />
                                <Typography variant="body2" sx={{ opacity: 0.92 }}>
                                    {item}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>

                <Stack
                    component="form"
                    onSubmit={onSubmit}
                    noValidate
                    justifyContent="center"
                    sx={{ p: { xs: 2.5, sm: 4, md: 5 } }}
                >
                    <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: 20, md: 24 } }}>
                        {formTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {formSubtitle}
                    </Typography>

                    {children}
                </Stack>
            </Paper>
        </Box>
    </Box>
);

export default AuthShell;
