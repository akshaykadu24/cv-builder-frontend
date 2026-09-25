import React, { useRef, useState } from 'react';
import {
    Box,
    ButtonBase,
    ClickAwayListener,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

/**
 * Labelled dropdown built on `Popper` rather than `Select`.
 *
 * `Select` renders its menu through `Popover`, which positions once on open and
 * never recalculates, so MUI locks page scroll to stop the menu drifting away
 * from its input. `Popper` instead listens for scroll/resize and repositions
 * against its anchor, so the page stays scrollable and the list stays attached.
 *
 * @param value    Currently selected option value.
 * @param options  `[{ value, label }]`.
 * @param onChange Called with the picked value.
 */
const TemplateSelect = ({ value, options, onChange, label = 'Template' }) => {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);

    const selected = options.find((option) => option.value === value);

    const handlePick = (next) => {
        setOpen(false);
        onChange(next);
    };

    return (
        <>
            <ButtonBase
                ref={anchorRef}
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`${label}: ${selected?.label || ''}`}
                sx={{
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { sm: 170 },
                    px: 1.5,
                    py: 0.9,
                    gap: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: open ? 'primary.main' : 'divider',
                    bgcolor: open ? 'common.white' : 'grey.50',
                    display: 'flex',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    boxShadow: open ? '0 0 0 4px rgba(25,118,210,.14)' : 'none',
                    transition: 'box-shadow .2s ease, border-color .2s ease, background-color .2s ease',
                    '&:hover': { bgcolor: 'common.white' },
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', lineHeight: 1.2, fontSize: 11 }}
                    >
                        {label}
                    </Typography>
                    <Typography noWrap sx={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>
                        {selected?.label}
                    </Typography>
                </Box>
                <ArrowDropDownIcon
                    sx={{
                        color: 'action.active',
                        transition: 'transform .2s ease',
                        transform: open ? 'rotate(180deg)' : 'none',
                    }}
                />
            </ButtonBase>

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                transition
                modifiers={[
                    { name: 'offset', options: { offset: [0, 6] } },
                    { name: 'preventOverflow', options: { padding: 8 } },
                ]}
                // Above the sticky AppBar (zIndex 1100)
                sx={{ zIndex: (theme) => theme.zIndex.modal }}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps} style={{ transformOrigin: 'top left' }}>
                        <Paper
                            elevation={8}
                            sx={{
                                minWidth: anchorRef.current?.offsetWidth,
                                borderRadius: 2,
                                overflow: 'hidden',
                            }}
                        >
                            <ClickAwayListener onClickAway={() => setOpen(false)}>
                                <MenuList
                                    autoFocusItem={open}
                                    dense
                                    onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
                                >
                                    {options.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            selected={option.value === value}
                                            onClick={() => handlePick(option.value)}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
};

export default TemplateSelect;
