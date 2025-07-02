import React from "react";

const ModernTemplate = ({ data }) => {
    const {
        basicDetails = {},
        education = [],
        experience = [],
        project = [],
        skill = [],
        socialProfile = [],
    } = data || {};

    const fontConfig = {
        nameSize: data?.fontConfig?.nameSize || 34,
        introSize: data?.fontConfig?.introSize || 14,
        contactSize: data?.fontConfig?.contactSize || 12,
        headingSize: data?.fontConfig?.headingSize || 15,
        itemSize: data?.fontConfig?.itemSize || 14,
        minHeight: data?.fontConfig?.minHeight || '950px',
        bodyFont: data?.fontConfig?.bodyFont || "Georgia, serif",
    };

    return (
        <div
            style={{
                fontFamily: fontConfig.bodyFont,
                backgroundColor: "#f5f7fa",
                borderRadius: 12,
                padding: 24,
                maxWidth: 800,
                margin: "10px auto",
                color: "#333",
                lineHeight: 1.15,
                minHeight: fontConfig.minHeight,
            }}
        >
            <div style={{ display: "flex", }}>
                <div>

                    {/* Name */}
                    <h1
                        style={{
                            fontSize: fontConfig.nameSize,
                            fontWeight: "700",
                            marginBottom: 8,
                            color: "#1a73e8",
                            lineHeight: 1.1,
                        }}
                    >
                        {basicDetails.name || "Your Name"}
                    </h1>

                    {/* Intro */}
                    <p
                        style={{
                            fontSize: fontConfig.introSize,
                            fontStyle: "italic",
                            marginBottom: 20,
                            color: "#555",
                            lineHeight: 1.1,
                        }}
                    >
                        {basicDetails.intro || "A short introduction about yourself goes here."}
                    </p>

                    {/* Contact Info */}
                    <div
                        style={{
                            fontSize: fontConfig.contactSize,
                            marginBottom: 20,
                            lineHeight: 1.15,
                            borderLeft: "4px solid #1a73e8",
                            paddingLeft: 12,
                            color: "#444",
                        }}
                    >
                        <div style={{ marginBottom: 4 }}>
                            <strong>Email:</strong> {basicDetails.email || "email@example.com"}
                        </div>
                        <div style={{ marginBottom: 4 }}>
                            <strong>Phone:</strong> {basicDetails.phone || "+1234567890"}
                        </div>
                        <div>
                            <strong>Address:</strong>{" "}
                            {`${basicDetails.address || ""}, ${basicDetails.city || ""}, ${basicDetails.state || ""
                                } - ${basicDetails.pincode || ""}`}
                        </div>
                    </div>
                </div>
                <div>
                    {basicDetails?.image && <img src={basicDetails?.image} alt="Preview" style={{ width: 100, height: 100, borderRadius: '50%', marginTop: 10 }} />}

                </div>
            </div>

            {/* Education */}
            <Section
                title="Education"
                items={education}
                titleSize={fontConfig.headingSize}
                itemSize={fontConfig.itemSize}
                render={(e) =>
                    `${e?.degree}, ${e?.institution} ${e?.percentage ? `(${e?.percentage}%),` : ""} ${e?.startYear
                    } - ${e?.endYear}, ${e?.location}`
                }
            />

            {/* Experience */}
            <Section
                title="Experience"
                items={experience}
                titleSize={fontConfig.headingSize}
                itemSize={fontConfig.itemSize}
                render={(e) =>
                    `${e.position || "-"} @ ${e.organization || "-"} (${e.joiningDate || "-"} - ${e.leavingDate || "Present"
                    }), ${e.joiningLocation || "-"}, CTC: ${e.CTC || "-"}, Tech: ${Array.isArray(e.technologies) ? e.technologies.join(", ") : e.technologies || "-"
                    }`
                }
            />

            {/* Projects */}
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
                        <strong>Tech:</strong> {Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies || "-"} —{" "}<br />
                        <strong>Desc:</strong> {p.description || '-'}
                    </>
                )}

            />

            {/* Skills */}
            <Section
                title="Skills"
                items={skill}
                titleSize={fontConfig.headingSize}
                itemSize={fontConfig.itemSize}
                render={(s) => `${s.skillName || "-"} (${s.level || "-"}%)`}
            />

            {/* Social Profiles */}
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
        </div>
    );
};

const Section = ({ title, items = [], render, titleSize, itemSize }) => (
    <div style={{ marginBottom: 24 }}>
        <h3
            style={{
                fontSize: titleSize,
                marginBottom: 10,
                borderBottom: "2px solid #1a73e8",
                paddingBottom: 4,
                lineHeight: 1.1,
            }}
        >
            {title}
        </h3>
        {items.length === 0 ? (
            <p style={{ fontSize: itemSize, color: "#999", lineHeight: 1.1 }}>No data available</p>
        ) : (
            <ul style={{ fontSize: itemSize, paddingLeft: 20, margin: 0, lineHeight: 1.3 }}>
                {items.map((item, index) => (
                    <li key={index} style={{ marginBottom: 6 }}>
                        {render(item)}
                    </li>
                ))}
            </ul>
        )}
    </div>
);

export default ModernTemplate;
