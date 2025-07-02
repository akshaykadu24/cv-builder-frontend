import React from 'react';

const SidebarTemplate = ({ data }) => {
    const {
        basicDetails = {},
        education = [],
        experience = [],
        project = [],
        skill = [],
        socialProfile = []  // always an array, no need to check
    } = data || {};

    const fontConfig = {
        nameSize: data?.fontConfig?.nameSize || 32,
        introSize: data?.fontConfig?.introSize || 14,
        contactSize: data?.fontConfig?.contactSize || 12,
        headingSize: data?.fontConfig?.headingSize || 16,
        itemSize: data?.fontConfig?.itemSize || 12,
        minHeight: data?.fontConfig?.minHeight || '950px',
        bodyFont: data?.fontConfig?.bodyFont || 'Arial, sans-serif'
    };

    return (
        <div
            style={{
                display: 'flex',
                maxWidth: 1000,
                margin: '10px auto',
                border: '1px solid #ccc',
                borderRadius: 8,
                fontFamily: fontConfig.bodyFont,
                overflow: 'hidden',
                minHeight: fontConfig.minHeight,
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                color: '#222',
                lineHeight: 1.15
            }}
        >
            {/* Sidebar */}
            <div
                style={{
                    backgroundColor: '#2c3e50',
                    color: 'white',
                    padding: 20,
                    width: '35%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div>
                    {basicDetails?.image && <img src={basicDetails?.image} alt="Preview" style={{ width: 100, height: 100, borderRadius: '50%', marginTop: 10 }} />}

                </div>
                <h1
                    style={{
                        fontSize: fontConfig.nameSize,
                        marginBottom: 8,
                        lineHeight: 1.1,
                        fontWeight: 'bold'
                    }}
                >
                    {basicDetails?.name || 'Your Name'}
                </h1>
                <p
                    style={{
                        fontSize: fontConfig.introSize,
                        fontStyle: 'italic',
                        color: '#ecf0f1',
                        marginBottom: 20,
                        lineHeight: 1.1
                    }}
                >
                    {basicDetails?.intro || 'A short introduction about yourself goes here.'}
                </p>

                <div style={{ fontSize: fontConfig.contactSize, lineHeight: 1.1, marginBottom: 24 }}>
                    <p style={{ margin: '4px 0' }}>
                        <strong>Email:</strong> {basicDetails?.email || 'email@example.com'}
                    </p>
                    <p style={{ margin: '4px 0' }}>
                        <strong>Phone:</strong> {basicDetails?.phone || '+1234567890'}
                    </p>
                    <p style={{ margin: '4px 0' }}>
                        <strong>Address:</strong> {`${basicDetails?.address || ''}, ${basicDetails?.city || ''}, ${basicDetails?.state || ''} - ${basicDetails?.pincode || ''}`}
                    </p>
                </div>



                {/* Social Profiles */}
                <div>
                    <h3
                        style={{
                            fontSize: fontConfig.headingSize,
                            borderBottom: '1px solid #fff',
                            paddingBottom: 4,
                            marginBottom: 8,
                            lineHeight: 1.1
                        }}
                    >
                        Social Profiles
                    </h3>
                    {socialProfile.length > 0 ? (
                        socialProfile.map((profile, i) => (
                            <div
                                key={i}
                                style={{
                                    fontSize: fontConfig.itemSize,
                                    marginBottom: 6,
                                    lineHeight: 1.1,
                                    wordBreak: 'break-word'
                                }}
                            >
                                <strong>{profile.platform || "Platform"}:</strong>{' '}
                                {profile.url ? (
                                    <a href={profile.url} target="_blank" rel="noreferrer" style={{ color: '#ecf0f1' }}>
                                        {profile.url}
                                    </a>
                                ) : (
                                    "No URL"
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{ fontSize: fontConfig.itemSize, color: '#ccc', lineHeight: 1.1 }}>
                            No social profile provided
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div
                style={{
                    padding: 20,
                    width: '65%',
                    backgroundColor: '#fff',
                    color: '#222',
                    lineHeight: 1.15,
                    overflowY: 'auto'
                }}
            >
                <Section
                    title="Education"
                    items={education}
                    titleSize={fontConfig.headingSize}
                    itemSize={fontConfig.itemSize}
                    render={(e) =>
                        `${e.degree || '-'}, ${e.institution || '-'} (${e.percentage || '-'}%), ${e.startYear || '-'} - ${e.endYear || '-'}, ${e.location || '-'}`
                    }
                />

                <Section
                    title="Experience"
                    items={experience}
                    titleSize={fontConfig.headingSize}
                    itemSize={fontConfig.itemSize}
                    render={(e) =>
                        `${e.position || '-'} @ ${e.organization || '-'}, ${e.joiningLocation || '-'} (${e.joiningDate || '-'} - ${e.leavingDate || 'Present'}), CTC: ${e.CTC || '-'}, Tech: ${Array.isArray(e.technologies) ? e.technologies.join(', ') : e.technologies || '-'}`
                    }
                />

                <Section
                    title="Projects"
                    items={project}
                    titleSize={fontConfig.headingSize}
                    itemSize={fontConfig.itemSize}
                    render={(p) => (
                        <>
                            <strong>{p.title || '-'}</strong>,{" "}<br />
                            <strong>Team:</strong> {p.teamSize || '-'},{" "}<br />
                            <strong>Duration:</strong> {p.duration || '-'},{" "}<br />
                            <strong>Tech:</strong>{" "}
                            {Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies || '-'},{" "}<br />
                            <strong>Desc:</strong> {p.description || '-'}
                        </>
                    )}
                />
                <div style={{ marginBottom: 24 }}>
                    <h3
                        style={{
                            fontSize: fontConfig.headingSize,
                            borderBottom: '1px solid #fff',
                            paddingBottom: 4,
                            marginBottom: 8,
                            lineHeight: 1.1
                        }}
                    >
                        Skills
                    </h3>
                    <ul style={{ paddingLeft: 20, fontSize: fontConfig.itemSize, margin: 0, lineHeight: 1.1 }}>
                        {skill.length > 0 ? (
                            skill.map((s, i) => (
                                <li key={i} style={{ marginBottom: 6 }}>
                                    {s.skillName || '-'} ({s.level || '-'}%)
                                </li>
                            ))
                        ) : (
                            <li style={{ color: '#ccc' }}>No skills provided</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, items = [], render, titleSize, itemSize }) => (
    <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: titleSize, color: '#34495e', marginBottom: 10, lineHeight: 1.1 }}>{title}</h3>
        {items.length === 0 ? (
            <p style={{ fontSize: itemSize, color: '#999', lineHeight: 1.1 }}>No data provided</p>
        ) : (
            <ul style={{ paddingLeft: 20, fontSize: itemSize, margin: 0, lineHeight: 1.1 }}>
                {items.map((item, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                        {render(item)}
                    </li>
                ))}
            </ul>
        )}
    </div>
);

export default SidebarTemplate;
