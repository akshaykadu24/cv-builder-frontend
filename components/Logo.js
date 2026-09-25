import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * "AK" monogram badge.
 *
 * Drawn in CSS rather than shipped as an image so it stays sharp on any
 * display density and can be recoloured per surface.
 *
 * @param size    Square edge length in px. Inner type scales with it.
 * @param variant 'gradient' for light backgrounds, 'light' for dark/gradient ones.
 */
const Logo = ({ size = 40, variant = 'gradient' }) => {
    const isLight = variant === 'light';

    return (
        <Box
            role="img"
            aria-label="AK logo"
            sx={{
                width: size,
                height: size,
                flexShrink: 0,
                borderRadius: `${size * 0.3}px`, // squircle, softer than a circle
                display: 'grid',
                placeItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                color: 'common.white',
                background: isLight
                    ? 'rgba(255,255,255,.18)'
                    : 'linear-gradient(135deg, #42a5f5 0%, #1565c0 55%, #0d3c74 100%)',
                boxShadow: isLight
                    ? 'inset 0 0 0 1px rgba(255,255,255,.45)'
                    : '0 4px 12px rgba(21,101,192,.38)',
                transition: 'transform .25s ease, box-shadow .25s ease',
                // Diagonal gloss so the badge reads as a physical object
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(160deg, rgba(255,255,255,.38), transparent 55%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <Typography
                component="span"
                sx={{
                    position: 'relative',
                    fontWeight: 800,
                    fontSize: size * 0.4,
                    letterSpacing: 0.5,
                    lineHeight: 1,
                    textShadow: '0 1px 2px rgba(0,0,0,.25)',
                }}
            >
                AK
            </Typography>
        </Box>
    );
};

export default Logo;
