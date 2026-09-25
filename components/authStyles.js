/**
 * Shared MUI `sx` objects for the auth pages (login / register).
 * Kept in one place so both screens stay visually identical.
 */

/* Layered shadow: tight contact shadow + soft ambient spread */
export const cardSx = {
    width: '100%',
    maxWidth: 960,
    borderRadius: { xs: 3, md: 4 },
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
    boxShadow: '0 1px 2px rgba(16,24,40,.06), 0 12px 24px -8px rgba(16,24,40,.12), 0 32px 64px -16px rgba(16,24,40,.16)',
    transition: 'box-shadow .3s ease, transform .3s ease',
    '&:hover': {
        transform: { md: 'translateY(-2px)' },
        boxShadow: '0 1px 2px rgba(16,24,40,.06), 0 18px 32px -8px rgba(16,24,40,.16), 0 44px 80px -16px rgba(16,24,40,.22)',
    },
};

/* Gradient panel with two soft radial glows so it doesn't read as flat */
export const brandSx = {
    position: 'relative',
    overflow: 'hidden',
    p: { xs: 3, sm: 4, md: 5 },
    color: 'common.white',
    background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 55%, #0d3c74 100%)',
    boxShadow: { md: 'inset -12px 0 24px -12px rgba(0,0,0,.35)' },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -80,
        right: -60,
        width: 260,
        height: 260,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,.28), transparent 70%)',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -100,
        left: -70,
        width: 240,
        height: 240,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,.16), transparent 70%)',
    },
};

export const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        bgcolor: 'grey.50',
        transition: 'box-shadow .2s ease, background-color .2s ease',
        '&:hover': { bgcolor: 'common.white' },
        '&.Mui-focused': {
            bgcolor: 'common.white',
            boxShadow: '0 0 0 4px rgba(25,118,210,.14)',
        },
    },
};

export const primaryBtnSx = {
    borderRadius: 2,
    py: 1.25,
    boxShadow: '0 4px 12px rgba(25,118,210,.35)',
    transition: 'box-shadow .2s ease, transform .2s ease',
    '&:hover': {
        boxShadow: '0 8px 20px rgba(25,118,210,.45)',
        transform: 'translateY(-1px)',
    },
    '&:active': { transform: 'translateY(0)' },
};

export const secondaryBtnSx = {
    borderRadius: 2,
    py: 1.1,
    '&:hover': { boxShadow: '0 4px 12px rgba(16,24,40,.10)' },
};

/**
 * Pins the label above the outline so the placeholder is visible immediately.
 * `notched` is required alongside `shrink`, otherwise the border draws
 * straight through the label text.
 */
export const labelSlotProps = {
    inputLabel: { shrink: true },
    input: { notched: true },
};

export const AUTH_HIGHLIGHTS = [
    'Pick from Classic, Modern and Sidebar templates',
    'Live preview while you type',
    'Download a print-ready PDF in one click',
];
