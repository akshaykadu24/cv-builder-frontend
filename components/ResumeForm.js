import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

/**
 * Per-section behaviour, mirroring the original handlers exactly.
 *  required — fields that render a required-field message
 *  trim     — whether the value is trimmed on change (differs per section)
 *  validate — whether handleValidation runs on change
 */
const SECTION_CONFIG = {
    basicDetails: { required: ['name', 'email'], trim: true, validate: false },
    education: { required: ['degree', 'institution'], trim: true, validate: false },
    experience: { required: ['organization', 'joiningLocation', 'position'], trim: false, validate: false },
    project: { required: ['title', 'description'], trim: false, validate: true },
    skill: { required: ['skillName', 'level'], trim: false, validate: true },
    socialProfile: { required: [], trim: false, validate: false },
};

const FULL_WIDTH_FIELDS = new Set(['intro', 'description', 'technologies', 'address', 'url', 'image']);
const MULTILINE_FIELDS = new Set(['intro', 'description']);
const NUMBER_FIELDS = new Set(['teamSize', 'level']);

/* Human-friendly labels for API field keys. The fallback below still handles
   any future camelCase field that is not listed here. */
const FIELD_LABELS = {
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    address: 'Street Address',
    pincode: 'PIN Code',
    intro: 'Professional Summary',
    degree: 'Degree',
    institution: 'Institution',
    percentage: 'Percentage',
    startYear: 'Start Year',
    endYear: 'End Year',
    organization: 'Organization',
    joiningLocation: 'Job Location',
    position: 'Position',
    CTC: 'CTC',
    joiningDate: 'Joining Date',
    leavingDate: 'Leaving Date',
    technologies: 'Technologies',
    title: 'Project Title',
    teamSize: 'Team Size',
    description: 'Description',
    skillName: 'Skill Name',
    level: 'Skill Level (%)',
    platform: 'Platform',
    url: 'Profile URL',
};

/** joiningLocation -> "Joining Location" */
const humanize = (field) =>
    field
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (char) => char.toUpperCase())
        .trim();

/**
 * Same rule FieldValidate applied: nothing while the value is undefined
 * (untouched), otherwise a required message when it is blank.
 */
const getFieldError = (fieldValue, fieldLabel) => {
    if (fieldValue === undefined) return '';
    const text = typeof fieldValue === 'string' ? fieldValue : String(fieldValue ?? '');
    return text.trim().length > 0 ? '' : `${fieldLabel} is required`;
};

const fieldSx = {
    '& .MuiInputLabel-root': {
        fontWeight: 600,
        color: 'text.secondary',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'primary.main',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        bgcolor: 'grey.50',
        transition: 'background-color .2s ease, box-shadow .2s ease',
        '& fieldset': { borderColor: 'grey.300' },
        '&:hover': {
            bgcolor: 'common.white',
            boxShadow: '0 3px 10px rgba(16,24,40,.08)',
        },
        '&:hover fieldset': { borderColor: 'primary.light' },
        '&.Mui-focused': {
            bgcolor: 'common.white',
            boxShadow: '0 0 0 4px rgba(25,118,210,.14)',
        },
    },
    '& .MuiInputBase-input::placeholder': {
        color: 'text.disabled',
        opacity: 0.8,
    },
    '& .MuiFormHelperText-root': {
        mx: 0.5,
    },
};

/**
 * Declared at module scope on purpose. Defining these inside ResumeForm would
 * give them a new function identity on every render, so React would treat them
 * as a different component type and remount the subtree, making the inputs lose
 * focus on every keystroke.
 */
const FieldGrid = ({ children }) => (
    <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
        }}
    >
        {children}
    </Box>
);

const Section = ({ icon, title, expanded, onToggle, count, children }) => (
    <Accordion
        expanded={expanded}
        onChange={onToggle}
        disableGutters
        elevation={0}
        sx={{
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            mb: 2,
            '&:before': { display: 'none' },
            '&.Mui-expanded': { mb: 2 },
        }}
    >
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
                position: 'relative',
                minHeight: 52,
                borderRadius: 2,
                bgcolor: 'grey.50',
                transition: 'background-color .2s ease',
                '&:hover': { bgcolor: 'grey.100' },
                '&.Mui-expanded': {
                    minHeight: 52,
                    bgcolor: 'rgba(25,118,210,.06)',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                },
                '& .MuiAccordionSummary-content': {
                    justifyContent: 'center',
                    my: 1.25,
                    mx: 4,
                },
                '& .MuiAccordionSummary-content.Mui-expanded': { my: 1.25 },
                '& .MuiAccordionSummary-expandIconWrapper': {
                    position: 'absolute',
                    right: 12,
                },
            }}
        >
            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
                <Typography fontWeight={700} sx={{ fontSize: { xs: 14.5, sm: 16 } }}>
                    {title}
                </Typography>
                {count != null && <Chip size="small" label={count} sx={{ height: 20 }} />}
            </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 2, pb: 2 }}>{children}</AccordionDetails>
    </Accordion>
);

const ResumeForm = ({ formData, setFormData, formError, setFormError }) => {
    const router = useRouter();
    const [collapsedSections, setCollapsedSections] = useState({});
    const [saving, setSaving] = useState(false);

    const toggleCollapse = (section) => {
        setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const parseFontValue = (val) => {
        const number = parseInt(val, 10);
        return isNaN(number) ? val : number;
    };

    let handleValidation = (field, value) => {
        if (field == "level") {
            if (value < 0 || value > 100) {
                alert("It accepts only in %, Please fill 0-100")
            }
        }
    }

    const availableFonts = [
        'Arial, sans-serif',
        'Times New Roman, serif',
        'Georgia, serif',
        'Tahoma, sans-serif',
        'Verdana, sans-serif',
        'Courier New, monospace',
        'Roboto, sans-serif',
    ];

    const handleChange = (section, key, value, index = null) => {
        if (section === "resumeName") {
            setFormData(prev => ({
                ...prev,
                [key]: value
            }));
        } else if (index !== null) {
            const updated = [...formData[section]];
            updated[index][key] = value;
            setFormData(prev => ({ ...prev, [section]: updated }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: value
                }
            }));
        }
    };

    const handleSubmit = async () => {
        setFormError(formData)

        let validationArray = ["resumeName", "name", "email", "degree", "institution", "organization", "joiningLocation", "position", "title", "description", "name", "level"]
        function isFieldMissing(field, formData) {
            switch (field) {
                case "resumeName":
                    return !formData.resumeName;

                case "name":
                case "email":
                    return !formData.basicDetails?.[field];

                case "degree":
                case "institution":
                    return !formData.education?.some(item => item[field]);

                case "organization":
                case "joiningLocation":
                case "position":
                    return !formData.experience?.some(item => item[field]);

                case "title":
                case "description":
                    return !formData.project?.some(item => item[field]);

                case "skillName":
                    return !formData.skill?.some(item => item.skillName);

                case "level":
                    return !formData.skill?.some(item => item.level >= 1 && item.level <= 100);

                default:
                    return false;
            }
        }

        function validateFormData(formData) {
            const missing = validationArray.filter(field => isFieldMissing(field, formData));
            return {
                isValid: missing.length === 0,
                missingFields: missing
            };
        }

        const validationResult = validateFormData(formData);

        if (!validationResult.isValid) {
            // console.log("Missing fields:", validationResult.missingFields);
        } else {
            setSaving(true);
            try {

                const cookieToken = document?.cookie?.split('; ').find(row => row.startsWith('ResumeToken='));
                const token = cookieToken?.split('=')[1];
                const url = router.query?.rid
                    ? `${process.env.NEXT_PUBLIC_API_URL}updateResume/${router.query?.rid}`
                    : `${process.env.NEXT_PUBLIC_API_URL}createResume`;
                const method = router.query?.rid ? "PATCH" : "POST";

                const res = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    body: JSON.stringify(formData)
                });

                const data = await res.json();
                alert(data?.msg);
            } catch (error) {
                console.error("Error submitting resume:", error);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => (({
                    ...prev,
                    basicDetails: {
                        ...prev.basicDetails,
                        image: reader.result
                    }
                })))
            };
            reader.readAsDataURL(file);
        }
    };

    /* ---------- rendering helpers ---------- */

    /** Wires a Section to the collapsedSections state. */
    const sectionProps = (sectionKey) => ({
        expanded: !collapsedSections[sectionKey],
        onToggle: () => toggleCollapse(sectionKey),
    });

    /** One text input. `index` stays null for object-shaped sections. */
    const renderField = ({ section, field, value, index = null, errorValue, label, compact = false }) => {
        const config = SECTION_CONFIG[section] || {};
        const isRequired = (config.required || []).includes(field);
        const fieldLabel = label || FIELD_LABELS[field] || humanize(field);

        const error = isRequired ? getFieldError(errorValue, fieldLabel) : '';

        return (
            <TextField
                key={`${section}-${field}-${index ?? 'single'}`}
                label={fieldLabel}
                required={isRequired}
                value={value ?? ''}
                type={NUMBER_FIELDS.has(field) ? 'number' : 'text'}
                multiline={MULTILINE_FIELDS.has(field)}
                minRows={MULTILINE_FIELDS.has(field) ? 3 : undefined}
                size="small"
                fullWidth
                sx={{
                    ...fieldSx,
                    gridColumn: !compact && FULL_WIDTH_FIELDS.has(field) ? { sm: '1 / -1' } : undefined,
                }}
                error={!!error}
                helperText={error}
                slotProps={{
                    inputLabel: { shrink: true },
                    input: { notched: true },
                    htmlInput: field === 'level' ? { min: 0, max: 100 } : undefined,
                }}
                onChange={(e) => {
                    const raw = e.target.value;
                    handleChange(section, field, config.trim ? raw?.trim() : raw, index);
                    if (config.validate) handleValidation(field, raw);
                }}
            />
        );
    };

    /**
     * Repeating sections (education, experience, ...). Remove stays restricted to
     * index !== 0, and errors keep reading from formError[section][0] as before.
     */
    const renderRepeatable = ({ sectionKey, title, icon, singular, blank, labelFor, compact = false }) => {
        const items = formData[sectionKey] || [];

        const removeItem = (index) => {
            const updated = items.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, [sectionKey]: updated }));
        };

        const RemoveButton = ({ index }) => (
            items.length > 1 && index !== 0 ? (
                <Tooltip title={`Remove ${singular.toLowerCase()}`}>
                    <IconButton size="small" color="error" onClick={() => removeItem(index)}>
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ) : null
        );

        return (
            <Section icon={icon} title={title} count={items.length} {...sectionProps(sectionKey)}>
                <Stack spacing={compact ? 1 : 2}>
                    {items.map((item, index) => (
                        <Paper
                            key={index}
                            variant="outlined"
                            sx={{
                                p: compact ? 1.25 : { xs: 1.5, sm: 2 },
                                borderRadius: 2,
                                bgcolor: 'grey.50',
                            }}
                        >
                            {compact ? (
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: 'minmax(0,1fr) minmax(0,1fr) auto' },
                                        gap: 1,
                                        alignItems: 'start',
                                    }}
                                >
                                    {Object.keys(item).map((field, i) => (
                                        field !== "_id" && renderField({
                                            section: sectionKey,
                                            field,
                                            value: item[field],
                                            index,
                                            errorValue: formError?.[sectionKey]?.[0]?.[field],
                                            label: labelFor?.(field, i, index),
                                            compact: true,
                                        })
                                    ))}
                                    <Box sx={{ justifySelf: { xs: 'end', sm: 'center' }, alignSelf: 'center' }}>
                                        <RemoveButton index={index} />
                                    </Box>
                                </Box>
                            ) : (
                                <>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        sx={{ mb: 1.5 }}
                                    >
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                                            {singular} {index + 1}
                                        </Typography>
                                        <RemoveButton index={index} />
                                    </Stack>

                                    <FieldGrid>
                                        {Object.keys(item).map((field, i) => (
                                            field !== "_id" && renderField({
                                                section: sectionKey,
                                                field,
                                                value: item[field],
                                                index,
                                                errorValue: formError?.[sectionKey]?.[0]?.[field],
                                                label: labelFor?.(field, i, index),
                                            })
                                        ))}
                                    </FieldGrid>
                                </>
                            )}
                        </Paper>
                    ))}

                    <Box>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => setFormData(prev => ({ ...prev, [sectionKey]: [...prev[sectionKey], blank] }))}
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                            Add {singular}
                        </Button>
                    </Box>
                </Stack>
            </Section>
        );
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                <BadgeOutlinedIcon color="primary" />
                <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: 17, sm: 20 } }}>
                    Create Your Resume
                </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
                Fields marked with * are required
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Section icon={<BadgeOutlinedIcon />} title="Resume Name" {...sectionProps('resumeName')}>
                {renderField({
                    section: 'resumeName',
                    field: 'resumeName',
                    label: 'Resume Name',
                    value: formData.resumeName,
                    errorValue: formData?.resumeName,
                })}
            </Section>

            <Section icon={<PersonOutlineIcon />} title="Basic Details" {...sectionProps('basicDetails')}>
                <FieldGrid>
                    {Object.keys(formData.basicDetails).map((field) => (
                        field !== "_id" && (
                            field === "image" ? (
                                <Stack
                                    key={field}
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                    sx={{ gridColumn: { sm: '1 / -1' } }}
                                >
                                    <Avatar
                                        src={formData?.basicDetails?.image || undefined}
                                        sx={{ width: 64, height: 64, bgcolor: 'grey.200' }}
                                    >
                                        <PhotoCameraOutlinedIcon color="disabled" />
                                    </Avatar>
                                    <Box>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            size="small"
                                            startIcon={<PhotoCameraOutlinedIcon />}
                                            sx={{ borderRadius: 2, textTransform: 'none' }}
                                        >
                                            Upload photo
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={handleImageChange}
                                            />
                                        </Button>
                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                            Optional. Square images look best.
                                        </Typography>
                                    </Box>
                                </Stack>
                            ) : renderField({
                                section: 'basicDetails',
                                field,
                                value: formData.basicDetails[field],
                                errorValue: formError?.basicDetails?.[field],
                            })
                        )
                    ))}
                </FieldGrid>
            </Section>

            {renderRepeatable({
                sectionKey: 'education',
                title: 'Education',
                singular: 'Education',
                icon: <SchoolOutlinedIcon />,
                blank: { degree: "", institution: "", percentage: "", startYear: "", endYear: "", location: "" },
            })}

            {renderRepeatable({
                sectionKey: 'experience',
                title: 'Experience',
                singular: 'Experience',
                icon: <WorkOutlineIcon />,
                blank: { organization: "", joiningLocation: "", position: "", CTC: "", joiningDate: "", leavingDate: "", technologies: "" },
            })}

            {renderRepeatable({
                sectionKey: 'project',
                title: 'Projects',
                singular: 'Project',
                icon: <FolderOutlinedIcon />,
                blank: { title: "", teamSize: "", duration: "", technologies: "", description: "" },
            })}

            {renderRepeatable({
                sectionKey: 'skill',
                title: 'Skills',
                singular: 'Skill',
                icon: <StarBorderIcon />,
                blank: { skillName: "", level: "" },
                compact: true,
                labelFor: (field, i, index) => (i === 0 ? `Skill Name ${index + 1}` : 'Skill Level (%)'),
            })}

            {renderRepeatable({
                sectionKey: 'socialProfile',
                title: 'Social Profiles',
                singular: 'Social Profile',
                icon: <ShareOutlinedIcon />,
                blank: { platform: "", url: "" },
                compact: true,
                labelFor: (field, i, index) => (i === 0 ? `Platform ${index + 1}` : 'Profile URL'),
            })}

            <Section icon={<TextFieldsOutlinedIcon />} title="Font Settings" {...sectionProps('fontConfig')}>
                <FieldGrid>
                    {Array.from(new Set([...Object.keys(formData?.fontConfig || {}), 'headingAlign'])).map((key) =>
                        key === 'bodyFont' ? (
                            <FormControl
                                key={key}
                                size="small"
                                fullWidth
                                sx={{ ...fieldSx, gridColumn: { sm: '1 / -1' } }}
                            >
                                <InputLabel id="body-font-label" shrink>Body Font</InputLabel>
                                <Select
                                    labelId="body-font-label"
                                    label="Body Font"
                                    notched
                                    value={formData?.fontConfig?.bodyFont || ''}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            fontConfig: {
                                                ...prev.fontConfig,
                                                bodyFont: e.target.value,
                                            },
                                        }))
                                    }
                                >
                                    {availableFonts.map((font) => (
                                        <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                                            {font}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : key === 'headingAlign' ? (
                            <FormControl key={key} size="small" fullWidth sx={fieldSx}>
                                <InputLabel id="heading-alignment-label" shrink>Heading Alignment</InputLabel>
                                <Select
                                    labelId="heading-alignment-label"
                                    label="Heading Alignment"
                                    notched
                                    value={formData?.fontConfig?.headingAlign || 'left'}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            fontConfig: {
                                                ...prev.fontConfig,
                                                headingAlign: e.target.value,
                                            },
                                        }))
                                    }
                                >
                                    <MenuItem value="left">Left</MenuItem>
                                    <MenuItem value="center">Center</MenuItem>
                                </Select>
                            </FormControl>
                        ) : (
                            <TextField
                                key={key}
                                label={humanize(key)}
                                size="small"
                                fullWidth
                                sx={fieldSx}
                                value={formData?.fontConfig?.[key] || ''}
                                slotProps={{ inputLabel: { shrink: true }, input: { notched: true } }}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        fontConfig: {
                                            ...prev.fontConfig,
                                            [key]: parseFontValue(e.target.value),
                                        },
                                    }))
                                }
                            />
                        )
                    )}
                </FieldGrid>
            </Section>

            <Button
                onClick={handleSubmit}
                variant="contained"
                size="large"
                fullWidth
                loading={saving}
                startIcon={<SaveOutlinedIcon />}
                sx={{
                    mt: 1,
                    py: 1.3,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: 16,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(25,118,210,.35)',
                    '&:hover': { boxShadow: '0 8px 20px rgba(25,118,210,.45)' },
                }}
            >
                Submit Resume
            </Button>
        </Box>
    );
};

export default ResumeForm;
