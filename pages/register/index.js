import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { parse } from 'cookie';
import {
    Alert,
    Button,
    Divider,
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

const INITIAL_FORM = { name: '', email: '', phone: '', password: '' };

const Register = () => {
    const router = useRouter();
    const [formData, setFormData] = useState(INITIAL_FORM);
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
        const { name, email, phone, password } = formData;

        if (!name.trim()) next.name = 'Name is required';
        if (!email.trim()) next.email = 'Email is required';
        else if (!isValidEmail(email.trim())) next.email = 'Enter a valid email address';
        if (phone.trim() && !/^\d{10}$/.test(phone.trim())) next.phone = 'Enter a 10 digit phone number';
        if (!password) next.password = 'Password is required';
        else if (password.length < 6) next.password = 'Use at least 6 characters';

        setErrors(next);
        return !Object.keys(next).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    password: formData.password,
                }),
            });
            const data = await res.json();

            if (data?.msg === 'User Created successfully') {
                setFormData(INITIAL_FORM);
                setToast({ severity: 'success', message: data.msg });
                router.push('/login');
                return;
            }
            setToast({ severity: 'error', message: data?.msg || 'Registration failed. Please try again.' });
        } catch {
            setToast({ severity: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            brandTitle="Create your account"
            brandSubtitle="Set up a free account and build a recruiter-ready CV in minutes."
            formTitle="Register"
            formSubtitle="Fill in your details to get started."
            onSubmit={handleSubmit}
        >
            <TextField
                label="Name"
                name="name"
                autoComplete="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
                sx={fieldSx}
                slotProps={labelSlotProps}
                fullWidth
                required
            />

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
                label="Phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="10 digit number (optional)"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                margin="normal"
                sx={fieldSx}
                slotProps={{
                    ...labelSlotProps,
                    htmlInput: { inputMode: 'numeric', maxLength: 10 },
                }}
                fullWidth
            />

            <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 6 characters"
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

            <Button
                type="submit"
                variant="contained"
                size="large"
                loading={loading}
                startIcon={<PersonAddAltIcon />}
                sx={{ ...primaryBtnSx, mt: 2 }}
            >
                Create account
            </Button>

            <Divider sx={{ my: { xs: 2, md: 3 } }}>Already registered?</Divider>

            <Button
                variant="outlined"
                size="large"
                startIcon={<LoginIcon />}
                onClick={() => router.push('/login')}
                sx={secondaryBtnSx}
            >
                Log in instead
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

export default Register;
