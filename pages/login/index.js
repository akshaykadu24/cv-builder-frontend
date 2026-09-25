import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { parse } from 'cookie';
import {
    Alert,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthShell from '@/components/AuthShell';
import { fieldSx, labelSlotProps, primaryBtnSx, secondaryBtnSx } from '@/components/authStyles';

export async function getServerSideProps({ req }) {
    const { ResumeToken } = parse(req.headers.cookie || '');

    if (ResumeToken) {
        return { redirect: { destination: '/', permanent: false } };
    }
    return { props: {} };
}

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleChange = ({ target: { name, value } }) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const next = {};
        if (!formData.email.trim()) next.email = 'Email is required';
        else if (!isValidEmail(formData.email.trim())) next.email = 'Enter a valid email address';
        if (!formData.password) next.password = 'Password is required';

        setErrors(next);
        return !Object.keys(next).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email.trim(), password: formData.password }),
            });
            const data = await res.json();

            if (data?.userID) {
                document.cookie = `ResumeToken=${data.token}; path=/; max-age=86400`; // 1 day
                router.push('/');
                return;
            }
            setToast({ severity: 'error', message: data?.msg || 'Invalid email or password' });
        } catch {
            setToast({ severity: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            brandTitle="Welcome back"
            brandSubtitle="Sign in to pick up right where you left off and keep polishing your CV."
            formTitle="Log in"
            formSubtitle="Enter your credentials to access your dashboard."
            onSubmit={handleSubmit}
        >
            <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                sx={fieldSx}
                slotProps={labelSlotProps}
                fullWidth
                required
            />

            <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
                sx={fieldSx}
                fullWidth
                required
                slotProps={{
                    ...labelSlotProps,
                    input: {
                        ...labelSlotProps.input,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <FormControlLabel
                control={<Checkbox size="small" defaultChecked />}
                label="Keep me signed in"
                sx={{ mb: 2 }}
            />

            <Button
                type="submit"
                variant="contained"
                size="large"
                loading={loading}
                startIcon={<LoginIcon />}
                sx={primaryBtnSx}
            >
                Log in
            </Button>

            <Divider sx={{ my: { xs: 2, md: 3 } }}>New here?</Divider>

            <Button
                variant="outlined"
                size="large"
                startIcon={<PersonAddAltIcon />}
                onClick={() => router.push('/register')}
                sx={secondaryBtnSx}
            >
                Create an account
            </Button>

            <Snackbar
                open={!!toast}
                autoHideDuration={4000}
                onClose={() => setToast(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={toast?.severity} variant="filled" onClose={() => setToast(null)}>
                    {toast?.message}
                </Alert>
            </Snackbar>
        </AuthShell>
    );
};

export default Login;
