import React from 'react';
import { dateRange, formatAddress, getFontConfig, joinTech } from './templateUtils';

/**
 * Minimal: single column, no colour, hairline rules and uppercase section
 * labels. The most ATS-friendly of the set since there are no sidebars or
 * columns for a parser to trip over.
 */
const MinimalTemplate = ({ data }) => {
    const {
        basicDetails = {},
        education = [],
        experience = [],
        project = [],
        skill = [],
        socialProfile = [],
    } = data || {};

    const font = getFontConfig(data, {
        nameSize: 30,
        headingSize: 12,
        itemSize: 12.5,
        bodyFont: 'Helvetica, Arial, sans-serif',
    });

    const contactBits = [
        basicDetails.email || 'email@example.com',
        basicDetails.phone,
        formatAddress(basicDetails),
    ].filter(Boolean);

    const Heading = ({ children }) => (
        <div
            style={{
                fontSize: font.headingSize,
                textAlign: font.headingAlign,
                textTransform: 'uppercase',
                letterSpacing: 2,
                fontWeight: 700,
                color: '#111',
                borderBottom: '1px solid #111',
                paddingBottom: 4,
                marginBottom: 10,
            }}
        >
            {children}
        </div>
    );

    const Empty = () => (
        <div style={{ fontSize: font.itemSize, color: '#9ca3af' }}>Not provided</div>
    );

    /** Title on the left, dates right-aligned on the same line. */
    const Row = ({ left, right }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: font.itemSize, fontWeight: 700, color: '#111', paddingRight: 8 }}>
                {left}
            </div>
            {right ? (
                <div style={{ fontSize: font.itemSize - 1, color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {right}
                </div>
            ) : null}
        </div>
    );

    const Meta = ({ children }) =>
        children ? (
            <div style={{ fontSize: font.itemSize - 0.5, color: '#4b5563', marginTop: 2 }}>{children}</div>
        ) : null;

    return (
        <div
            style={{
                fontFamily: font.bodyFont,
                backgroundColor: '#ffffff',
                color: '#111',
                maxWidth: 750,
                margin: '10px auto',
                padding: 36,
                lineHeight: 1.35,
                minHeight: font.minHeight,
            }}
        >
            {/* Header */}
            <div style={{ borderBottom: '2px solid #111', paddingBottom: 14, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ paddingRight: 12 }}>
                        <div
                            style={{
                                fontSize: font.nameSize,
                                fontWeight: 700,
                                letterSpacing: 1,
                                textTransform: 'uppercase',
                                lineHeight: 1.1,
                            }}
                        >
                            {basicDetails.name || 'Your Name'}
                        </div>
                        <div
                            style={{
                                fontSize: font.contactSize,
                                color: '#4b5563',
                                marginTop: 8,
                                lineHeight: 1.5,
                            }}
                        >
                            {contactBits.join('  ·  ')}
                        </div>
                    </div>
                    {basicDetails.image ? (
                        <img
                            src={basicDetails.image}
                            alt=""
                            style={{ width: 78, height: 78, objectFit: 'cover', borderRadius: 2 }}
                        />
                    ) : null}
                </div>

                {basicDetails.intro ? (
                    <div
                        style={{
                            fontSize: font.introSize,
                            color: '#374151',
                            marginTop: 12,
                            lineHeight: 1.5,
                        }}
                    >
                        {basicDetails.intro}
                    </div>
                ) : null}
            </div>

            {/* Experience */}
            <div style={{ marginBottom: 22 }}>
                <Heading>Experience</Heading>
                {experience.length === 0 ? <Empty /> : experience.map((item, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                        <Row
                            left={`${item.position || '-'}${item.organization ? `, ${item.organization}` : ''}`}
                            right={dateRange(item.joiningDate, item.leavingDate)}
                        />
                        <Meta>
                            {[item.joiningLocation, item.CTC ? `CTC: ${item.CTC}` : '']
                                .filter(Boolean)
                                .join('  ·  ')}
                        </Meta>
                        <Meta>{joinTech(item.technologies)}</Meta>
                    </div>
                ))}
            </div>

            {/* Projects */}
            <div style={{ marginBottom: 22 }}>
                <Heading>Projects</Heading>
                {project.length === 0 ? <Empty /> : project.map((item, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                        <Row left={item.title || '-'} right={item.duration} />
                        <Meta>
                            {[item.teamSize ? `Team of ${item.teamSize}` : '', joinTech(item.technologies)]
                                .filter(Boolean)
                                .join('  ·  ')}
                        </Meta>
                        {item.description ? (
                            <div style={{ fontSize: font.itemSize, color: '#374151', marginTop: 3 }}>
                                {item.description}
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>

            {/* Education */}
            <div style={{ marginBottom: 22 }}>
                <Heading>Education</Heading>
                {education.length === 0 ? <Empty /> : education.map((item, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                        <Row
                            left={`${item.degree || '-'}${item.institution ? `, ${item.institution}` : ''}`}
                            right={dateRange(item.startYear, item.endYear, '')}
                        />
                        <Meta>
                            {[item.location, item.percentage ? `${item.percentage}%` : '']
                                .filter(Boolean)
                                .join('  ·  ')}
                        </Meta>
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 22 }}>
                <Heading>Skills</Heading>
                {skill.length === 0 ? <Empty /> : (
                    <div style={{ fontSize: font.itemSize, color: '#374151', lineHeight: 1.6 }}>
                        {skill
                            .map((s) => `${s.skillName || '-'}${s.level ? ` (${s.level}%)` : ''}`)
                            .join('   ·   ')}
                    </div>
                )}
            </div>

            {/* Social */}
            <div>
                <Heading>Profiles</Heading>
                {socialProfile.length === 0 ? <Empty /> : socialProfile.map((item, i) => (
                    <div
                        key={i}
                        style={{
                            fontSize: font.itemSize,
                            color: '#374151',
                            marginBottom: 4,
                            wordBreak: 'break-word',
                        }}
                    >
                        <span style={{ fontWeight: 700 }}>{item.platform || 'Platform'}: </span>
                        {item.url || 'No URL'}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MinimalTemplate;
