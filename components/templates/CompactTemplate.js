import React from 'react';
import { dateRange, formatAddress, getFontConfig, joinTech, levelToPercent } from './templateUtils';

const DARK = '#1f2937';
const ACCENT = '#2563eb';

/**
 * Compact: dark full-width header band, then a two-column body with the
 * narrative on the left and a light rail on the right.
 *
 * Differs from Sidebar, which runs a full-height dark column down one side.
 * Here the colour sits only in the header, so the body stays dense and light.
 */
const CompactTemplate = ({ data }) => {
    const {
        basicDetails = {},
        education = [],
        experience = [],
        project = [],
        skill = [],
        socialProfile = [],
    } = data || {};

    const font = getFontConfig(data, {
        nameSize: 28,
        headingSize: 12,
        itemSize: 11.5,
        contactSize: 11,
        bodyFont: 'Tahoma, Geneva, sans-serif',
    });

    const MainHeading = ({ children }) => (
        <div
            style={{
                fontSize: font.headingSize,
                fontWeight: 700,
                textAlign: font.headingAlign,
                color: DARK,
                textTransform: 'uppercase',
                letterSpacing: 1.4,
                borderBottom: `2px solid ${ACCENT}`,
                paddingBottom: 3,
                marginBottom: 9,
            }}
        >
            {children}
        </div>
    );

    const RailHeading = ({ children }) => (
        <div
            style={{
                fontSize: font.headingSize,
                fontWeight: 700,
                textAlign: font.headingAlign,
                color: DARK,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                borderBottom: '1px solid #cbd5e1',
                paddingBottom: 3,
                marginBottom: 8,
            }}
        >
            {children}
        </div>
    );

    const Empty = () => <div style={{ fontSize: font.itemSize, color: '#9ca3af' }}>Not provided</div>;

    return (
        <div
            style={{
                fontFamily: font.bodyFont,
                backgroundColor: '#ffffff',
                color: DARK,
                maxWidth: 800,
                margin: '10px auto',
                lineHeight: 1.3,
                minHeight: font.minHeight,
                border: '1px solid #e5e7eb',
            }}
        >
            {/* Header band */}
            <div
                style={{
                    backgroundColor: DARK,
                    color: '#fff',
                    padding: 22,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: font.nameSize,
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            lineHeight: 1.1,
                        }}
                    >
                        {basicDetails.name || 'Your Name'}
                    </div>
                    <div
                        style={{
                            fontSize: font.introSize,
                            color: '#cbd5e1',
                            marginTop: 6,
                            lineHeight: 1.4,
                        }}
                    >
                        {basicDetails.intro || 'A short introduction about yourself goes here.'}
                    </div>
                    <div
                        style={{
                            fontSize: font.contactSize,
                            color: '#93c5fd',
                            marginTop: 8,
                            lineHeight: 1.5,
                        }}
                    >
                        {[basicDetails.email || 'email@example.com', basicDetails.phone, formatAddress(basicDetails)]
                            .filter(Boolean)
                            .join('   ·   ')}
                    </div>
                </div>

                {basicDetails.image ? (
                    <img
                        src={basicDetails.image}
                        alt=""
                        style={{
                            width: 76,
                            height: 76,
                            borderRadius: 4,
                            objectFit: 'cover',
                            marginLeft: 16,
                            flexShrink: 0,
                            border: '2px solid #4b5563',
                        }}
                    />
                ) : null}
            </div>

            {/* Body */}
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
                {/* Main column */}
                <div style={{ width: '62%', padding: 20, minWidth: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                        <MainHeading>Experience</MainHeading>
                        {experience.length === 0 ? <Empty /> : experience.map((item, i) => (
                            <div key={i} style={{ marginBottom: 11 }}>
                                <div style={{ fontSize: font.itemSize + 1, fontWeight: 700 }}>
                                    {item.position || '-'}
                                </div>
                                <div style={{ fontSize: font.itemSize, color: ACCENT, fontWeight: 700 }}>
                                    {item.organization || '-'}
                                </div>
                                <div style={{ fontSize: font.itemSize - 0.5, color: '#6b7280', marginTop: 1 }}>
                                    {[dateRange(item.joiningDate, item.leavingDate), item.joiningLocation]
                                        .filter(Boolean)
                                        .join('  ·  ')}
                                </div>
                                {joinTech(item.technologies) ? (
                                    <div style={{ fontSize: font.itemSize - 0.5, color: '#374151', marginTop: 2 }}>
                                        {joinTech(item.technologies)}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>

                    <div>
                        <MainHeading>Projects</MainHeading>
                        {project.length === 0 ? <Empty /> : project.map((item, i) => (
                            <div key={i} style={{ marginBottom: 11 }}>
                                <div style={{ fontSize: font.itemSize + 1, fontWeight: 700 }}>
                                    {item.title || '-'}
                                </div>
                                <div style={{ fontSize: font.itemSize - 0.5, color: '#6b7280', marginTop: 1 }}>
                                    {[
                                        item.duration,
                                        item.teamSize ? `Team of ${item.teamSize}` : '',
                                        joinTech(item.technologies),
                                    ]
                                        .filter(Boolean)
                                        .join('  ·  ')}
                                </div>
                                {item.description ? (
                                    <div
                                        style={{
                                            fontSize: font.itemSize,
                                            color: '#374151',
                                            marginTop: 3,
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        {item.description}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rail */}
                <div
                    style={{
                        width: '38%',
                        padding: 20,
                        backgroundColor: '#f3f4f6',
                        borderLeft: '1px solid #e5e7eb',
                        minWidth: 0,
                    }}
                >
                    <div style={{ marginBottom: 18 }}>
                        <RailHeading>Skills</RailHeading>
                        {skill.length === 0 ? <Empty /> : skill.map((item, i) => (
                            <div key={i} style={{ marginBottom: 8 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: font.itemSize,
                                        marginBottom: 3,
                                    }}
                                >
                                    <span style={{ fontWeight: 700 }}>{item.skillName || '-'}</span>
                                    <span style={{ color: '#6b7280' }}>{item.level ? `${item.level}%` : ''}</span>
                                </div>
                                <div style={{ height: 5, backgroundColor: '#d1d5db', borderRadius: 3 }}>
                                    <div
                                        style={{
                                            height: 5,
                                            width: `${levelToPercent(item.level)}%`,
                                            backgroundColor: ACCENT,
                                            borderRadius: 3,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: 18 }}>
                        <RailHeading>Education</RailHeading>
                        {education.length === 0 ? <Empty /> : education.map((item, i) => (
                            <div key={i} style={{ marginBottom: 9 }}>
                                <div style={{ fontSize: font.itemSize, fontWeight: 700 }}>{item.degree || '-'}</div>
                                <div style={{ fontSize: font.itemSize - 0.5, color: '#4b5563' }}>
                                    {item.institution || '-'}
                                </div>
                                <div style={{ fontSize: font.itemSize - 1, color: '#6b7280', marginTop: 1 }}>
                                    {[
                                        dateRange(item.startYear, item.endYear, ''),
                                        item.percentage ? `${item.percentage}%` : '',
                                        item.location,
                                    ]
                                        .filter(Boolean)
                                        .join('  ·  ')}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <RailHeading>Profiles</RailHeading>
                        {socialProfile.length === 0 ? <Empty /> : socialProfile.map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    fontSize: font.itemSize - 0.5,
                                    marginBottom: 6,
                                    wordBreak: 'break-word',
                                }}
                            >
                                <div style={{ fontWeight: 700 }}>{item.platform || 'Platform'}</div>
                                <div style={{ color: ACCENT }}>{item.url || 'No URL'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompactTemplate;
