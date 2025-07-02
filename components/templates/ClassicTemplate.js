import React from 'react';
import { Box, Typography, Divider, Paper, Grid } from '@mui/material';

const ClassicTemplate = ({ data }) => {
    const {
        basicDetails = {},
        education = [],
        experience = [],
        project = [],
        skill = [],
        socialProfile = []
    } = data || {};

    const fontConfig = {
        nameSize: data?.fontConfig?.nameSize || 34,
        introSize: data?.fontConfig?.introSize || 14,
        contactSize: data?.fontConfig?.contactSize || 12,
        headingSize: data?.fontConfig?.headingSize || 15,
        itemSize: data?.fontConfig?.itemSize || 14,
        minHeight: data?.fontConfig?.minHeight || '950px',
        bodyFont: data?.fontConfig?.bodyFont || 'Georgia, serif'
    };

    return (
        <Paper
            elevation={2}
            sx={{
                padding: 2,             // tight padding
                maxWidth: 700,
                margin: '10px auto',   // tight margin
                fontFamily: fontConfig.bodyFont,
                backgroundColor: '#fafafa',
                color: '#222',
                lineHeight: 1.15,     // tight line height globally
                minHeight: fontConfig.minHeight,
            }}
            id="resume-content"
        >
            <div style={{ display: "flex", }}>
                <div>

                    {/* Header */}
                    <Box textAlign="center" mb={2}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: fontConfig.nameSize,
                                fontWeight: 'bold',
                                letterSpacing: 1,
                                color: '#111',
                                lineHeight: 1.1,
                                mb: 0.5
                            }}
                        >
                            {basicDetails?.name || 'Your Name'}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: fontConfig.introSize,
                                fontStyle: 'italic',
                                color: '#555',
                                lineHeight: 1.1
                            }}
                        >
                            {basicDetails?.intro || 'Brief professional summary or objective.'}
                        </Typography>
                    </Box>

                    {/* Contact Info */}
                    <Grid container spacing={0.5} mb={2} justifyContent="center">
                        <Grid item xs={12} sm={4}>
                            <ContactInfo label="Email" value={basicDetails?.email || 'email@example.com'} size={fontConfig.contactSize} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <ContactInfo label="Phone" value={basicDetails?.phone || '+1234567890'} size={fontConfig.contactSize} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <ContactInfo
                                label="Address"
                                value={`${basicDetails?.address || ''}, ${basicDetails?.city || ''}, ${basicDetails?.state || ''} - ${basicDetails?.pincode || ''}`}
                                size={fontConfig.contactSize}
                            />
                        </Grid>
                    </Grid>
                </div>
                <div>
                    {basicDetails?.image && <img src={basicDetails?.image} alt="Preview" style={{ width: 100, height: 100, borderRadius: '50%', marginTop: 10 }} />}

                </div>
            </div>

            <Divider sx={{ mb: 1 }} />

            {/* Education */}
            <SectionTwoColumn
                title="Education"
                items={education}
                render={(e) => (
                    <>
                        <strong>{e.degree || '-'}</strong> &mdash; {e.institution || '-'}
                        <br />
                        {e.startYear || '-'} to {e.endYear || '-'}, {e.location || '-'}
                        <br />
                        Percentage: {e.percentage || '-'}%
                    </>
                )}
                fontConfig={fontConfig}
            />

            {/* Experience */}
            <SectionTwoColumn
                title="Experience"
                items={experience}
                render={(e) => (
                    <>
                        <strong>{e.position || '-'}</strong> @ {e.organization || '-'}
                        <br />
                        {e.joiningDate || '-'} to {e.leavingDate || 'Present'}, {e.joiningLocation || '-'}
                        <br />
                        CTC: {e.CTC || '-'}
                        <br />
                        Tech: {Array.isArray(e.technologies) ? e.technologies.join(', ') : e.technologies || '-'}
                    </>
                )}
                fontConfig={fontConfig}
            />

            {/* Projects */}
            <SectionTwoColumn
                title="Projects"
                items={project}
                render={(p) => (
                    <>
                        <strong>{p.title || '-'}</strong>{" "}
                        (<strong>Team:</strong> {p.teamSize || '-'},{" "}
                        <strong>Duration:</strong> {p.duration || '-'})
                        <br />
                        <strong>Desc:</strong> {p.description || '-'}
                        <br />
                        <strong>Tech:</strong>{" "}
                        {Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies || '-'}
                    </>
                )}

                fontConfig={fontConfig}
            />

            {/* Skills */}
            <SectionTwoColumn
                title="Skills"
                items={skill}
                render={(s) => (
                    <>
                        {s.skillName || '-'} <em>({s.level || '-'}%)</em>
                    </>
                )}
                fontConfig={fontConfig}
            />

            {/* Social Profiles - updated as requested */}
            <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: fontConfig.headingSize, marginBottom: 10, lineHeight: 1.1 }}>
                    Social Profiles
                </h3>
                {socialProfile.length > 0 ? (
                    socialProfile.map((profile, index) => (
                        <div key={index} style={{ fontSize: fontConfig.itemSize, marginBottom: 6, lineHeight: 1.1 }}>
                            <strong>{profile.platform || "Platform"}:</strong>{" "}
                            {profile.url ? (
                                <a href={profile.url} target="_blank" rel="noreferrer">
                                    {profile.url}
                                </a>
                            ) : (
                                "No URL"
                            )}
                        </div>
                    ))
                ) : (
                    <div style={{ fontSize: fontConfig.itemSize, color: "#999", lineHeight: 1.1 }}>
                        No social profile provided
                    </div>
                )}
            </div>
        </Paper>
    );
};

const ContactInfo = ({ label, value, size }) => (
    <Typography
        variant="body2"
        sx={{
            fontSize: size,
            lineHeight: 1.1,
            mb: 0.3
        }}
    >
        <strong>{label}:</strong> {value}
    </Typography>
);

const SectionTwoColumn = ({ title, items = [], render, fontConfig }) => (
    <Box my={1.5}>
        <Typography
            variant="h6"
            sx={{
                fontWeight: 'bold',
                fontSize: fontConfig.headingSize,
                mb: 0.5,
                borderBottom: '1px solid #bbb',
                paddingBottom: 0.7,
                color: '#333',
                lineHeight: 1.1,
            }}
        >
            {title}
        </Typography>
        {items.length === 0 ? (
            <Typography sx={{ fontSize: fontConfig.itemSize, color: '#999', lineHeight: 1.1 }}>
                No data available
            </Typography>
        ) : (
            items.map((item, idx) => (
                <Grid container key={idx} spacing={0} sx={{ mb: 0.5, lineHeight: 1.1 }}>
                    <Grid
                        item
                        xs={4}
                        sx={{ fontWeight: 'bold', fontSize: fontConfig.itemSize, color: '#555', lineHeight: 1.1, marginRight: "3px" }}
                    >
                        {
                            // console.log(title)
                            title == "Skills" ? "" :
                                (title == "Education" || title == "Experience") ? `${title} ${idx + 1} `
                                    : `${title.slice(0, -1)} ${idx + 1} `
                        }
                    </Grid>
                    <Grid item xs={8} sx={{ fontSize: fontConfig.itemSize, lineHeight: 1.1 }}>
                        {render(item)}
                    </Grid>
                </Grid>
            ))
        )}
    </Box>
);

export default ClassicTemplate;
