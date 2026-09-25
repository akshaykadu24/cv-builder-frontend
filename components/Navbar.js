import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Logo from '@/components/Logo';

const AUTHED_ITEMS = [
    { label: 'Dashboard', path: '/', icon: <DashboardOutlinedIcon /> },
    { label: 'Log Out', path: '/logout', icon: <LogoutIcon /> },
];

const GUEST_ITEMS = [
    { label: 'Log In', path: '/login', icon: <LoginIcon /> },
    { label: 'Sign Up', path: '/register', icon: <PersonAddAltIcon /> },
];

const Navbar = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        // Cookies are only readable on the client
        setIsAuthenticated(document.cookie.split('; ').some((row) => row.startsWith('ResumeToken=')));
        setMounted(true);
    }, []);

    const handleClick = (path) => {
        setDrawerOpen(false);

        if (path === '/logout') {
            document.cookie = 'ResumeToken=; path=/; max-age=0';
            setIsAuthenticated(false);
            router.push('/login');
            return;
        }
        router.push(path);
    };

    const items = isAuthenticated ? AUTHED_ITEMS : GUEST_ITEMS;

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'common.white',
                    color: 'text.primary',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 2px 6px rgba(16,24,40,.08), 0 12px 28px -14px rgba(16,24,40,.20)',
                }}
            >
                <Toolbar
                    sx={{
                        gap: 1.5,
                        minHeight: { xs: '64px !important', sm: '74px !important' },
                        px: { xs: 1.5, sm: 3, md: 5 },
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        onClick={() => handleClick('/')}
                        sx={{
                            flexGrow: 0,
                            mr: 'auto',
                            cursor: 'pointer',
                            minWidth: 0,
                            width: 'fit-content',
                            maxWidth: 'max-content',
                            borderRadius: 2,
                            px: 0.75,
                            py: 0.5,
                            transition: 'background-color .2s ease, transform .2s ease',
                            '&:hover': {
                                bgcolor: 'rgba(25,118,210,.06)',
                                transform: 'translateY(-1px)',
                            },
                            '&:hover [role="img"]': { transform: 'scale(1.08) rotate(-2deg)' },
                        }}
                    >
                        <Logo size={44} />
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="h6"
                                noWrap
                                fontWeight={800}
                                sx={{ fontSize: { xs: 18, sm: 23 }, lineHeight: 1.1, letterSpacing: -0.3 }}
                            >
                                Resume Builder
                            </Typography>
                            <Typography
                                variant="caption"
                                noWrap
                                color="primary.main"
                                sx={{
                                    display: { xs: 'none', sm: 'block' },
                                    mt: 0.25,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: 1.8,
                                }}
                            >
                                BY AKSHAY
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Desktop links */}
                    {mounted && (
                        <Stack direction="row" spacing={1.25} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                            {items.map(({ label, path, icon }) => (
                                <Button
                                    key={path}
                                    size="large"
                                    startIcon={icon}
                                    onClick={() => handleClick(path)}
                                    variant={path === '/register' || router.pathname === path ? 'contained' : 'outlined'}
                                    color={path === '/logout' ? 'error' : 'primary'}
                                    sx={{
                                        minHeight: 42,
                                        px: 2,
                                        borderRadius: 2.5,
                                        textTransform: 'none',
                                        fontSize: 14.5,
                                        fontWeight: 700,
                                        transition: 'transform .2s ease, box-shadow .2s ease, background-color .2s ease',
                                        '& .MuiButton-startIcon > svg': { fontSize: 20 },
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: path === '/logout'
                                                ? '0 6px 16px rgba(211,47,47,.18)'
                                                : '0 6px 16px rgba(25,118,210,.24)',
                                        },
                                        '&:active': { transform: 'translateY(0)' },
                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Stack>
                    )}

                    {/* Mobile trigger */}
                    <IconButton
                        edge="end"
                        aria-label="Open navigation menu"
                        onClick={() => setDrawerOpen(true)}
                        sx={{
                            display: { xs: 'inline-flex', sm: 'none' },
                            width: 44,
                            height: 44,
                            color: 'primary.main',
                            bgcolor: 'rgba(25,118,210,.08)',
                            border: '1px solid',
                            borderColor: 'rgba(25,118,210,.22)',
                            '&:hover': { bgcolor: 'rgba(25,118,210,.14)' },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                slotProps={{ paper: { sx: { width: { xs: 280, sm: 300 } } } }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 2.5 }}>
                    <Logo size={42} />
                    <Box>
                        <Typography fontSize={18} fontWeight={800} lineHeight={1.1}>Resume Builder</Typography>
                        <Typography variant="caption" color="primary.main" fontWeight={700} letterSpacing={1.5}>
                            BY AKSHAY
                        </Typography>
                    </Box>
                </Stack>
                <Divider />

                <List sx={{ p: 1.5 }}>
                    {items.map(({ label, path, icon }) => (
                        <ListItemButton
                            key={path}
                            selected={router.pathname === path}
                            onClick={() => handleClick(path)}
                            sx={{
                                minHeight: 50,
                                mb: 0.75,
                                borderRadius: 2,
                                color: path === '/logout' ? 'error.main' : 'text.primary',
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(25,118,210,.10)',
                                    color: 'primary.main',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 42, color: path === '/logout' ? 'error.main' : 'primary.main' }}>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={label} slotProps={{ primary: { fontWeight: 700 } }} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
        </>
    );
};

export default Navbar;
