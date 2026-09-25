import React from 'react';
import { dateRange, formatAddress, getFontConfig, joinTech, levelToPercent } from './templateUtils';

const GOLD = '#b08d57';
const INK = '#2b2b2b';

/**
 * Elegant: centred serif header on a warm cream page with gold rules and
 * small-caps headings. Skill levels render as filled dots out of five rather
 * than bars, which suits the typographic feel.
 */
const ElegantTemplate = ({ data }) => {
    const {
        basicDetails = {},
        education = [],
        experience = [],
        project = [],
        skill = [],
        socialProfile = [],
    } = data || {};

    const font = getFontConfig(data, {
        nameSize: 34,
        headingSize: 13,
        itemSize: 12.5,
        bodyFont: 'Georgia, "Times New Roman", serif',
    });

    /** Centred label with a short gold rule beneath it. */
    const Heading = ({ children }) => (
        <div style={{ textAlign: font.headingAlign, marginBottom: 12 }}>
            <div
                style={{
                    fontSize: font.headingSize,
                    fontWeight: 700,
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    color: INK,
                }}
            >
                {children}
            </div>
            <div
                style={{
                    width: 46,
                    height: 2,
                    backgroundColor: GOLD,
                    margin: font.headingAlign === 'center' ? '5px auto 0' : '5px 0 0',
                }}
            />
        </div>
    );

    const Empty = () => (
        <div style={{ fontSize: font.itemSize, color: '#a1a1a1', textAlign: 'center', fontStyle: 'italic' }}>
            Not provided
        </div>
    );

    const Entry = ({ title, subtitle, right, body }) => (
        <div style={{ marginBottom: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: font.itemSize + 1.5, fontWeight: 700, color: INK, paddingRight: 8 }}>
                    {title}
                </div>
                {right ? (
                    <div style={{ fontSize: font.itemSize - 1, color: GOLD, whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                        {right}
                    </div>
                ) : null}
            </div>
            {subtitle ? (
                <div style={{ fontSize: font.itemSize, color: '#5c5c5c', fontStyle: 'italic', marginTop: 1 }}>
                    {subtitle}
                </div>
            ) : null}
            {body ? (
                <div style={{ fontSize: font.itemSize, color: '#3f3f3f', marginTop: 3, lineHeight: 1.5 }}>
                    {body}
                </div>
            ) : null}
        </div>
    );

    /** level 0-100 mapped onto five dots. */
    const Dots = ({ level }) => {
        const filled = Math.round(levelToPercent(level) / 20);
        return (
            <span>
                {[0, 1, 2, 3, 4].map((i) => (
                    <span
                        key={i}
                        style={{
                            display: 'inline-block',
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            marginLeft: 3,
                            backgroundColor: i < filled ? GOLD : 'transparent',
                            border: `1px solid ${GOLD}`,
                        }}
                    />
                ))}
            </span>
        );
    };

    return (
        <div
            style={{
                fontFamily: font.bodyFont,
                backgroundColor: '#fdfaf5',
                color: INK,
                maxWidth: 760,
                margin: '10px auto',
                padding: 34,
                lineHeight: 1.35,
                minHeight: font.minHeight,
                border: `1px solid #ece3d5`,
            }}
        >
            {/* Header */}
            <div style={{ textAlign: 'center', paddingBottom: 16 }}>
                {basicDetails.image ? (
                    <img
                        src={basicDetails.image}
                        alt=""
                        style={{
                            width: 92,
                            height: 92,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: `2px solid ${GOLD}`,
                            marginBottom: 12,
                        }}
                    />
                ) : null}

                <div
                    style={{
                        fontSize: font.nameSize,
                        fontWeight: 400,
                        letterSpacing: 4,
                        textTransform: 'uppercase',
                        lineHeight: 1.15,
                    }}
                >
                    {basicDetails.name || 'Your Name'}
                </div>

                {/* Double rule ornament */}
                <div style={{ borderTop: `2px solid ${GOLD}`, margin: '12px auto 3px', width: '58%' }} />
                <div style={{ borderTop: `1px solid ${GOLD}`, margin: '0 auto', width: '38%' }} />

                <div
                    style={{
                        fontSize: font.introSize,
                        fontStyle: 'italic',
                        color: '#5c5c5c',
                        marginTop: 12,
                        lineHeight: 1.55,
                    }}
                >
                    {basicDetails.intro || 'A short introduction about yourself goes here.'}
                </div>

                <div style={{ fontSize: font.contactSize, color: '#6b6b6b', marginTop: 10, lineHeight: 1.6 }}>
                    {[basicDetails.email || 'email@example.com', basicDetails.phone, formatAddress(basicDetails)]
                        .filter(Boolean)
                        .join('   ·   ')}
                </div>
            </div>

            <div style={{ borderTop: '1px solid #e6dbc9', margin: '6px 0 20px' }} />

            {/* Experience */}
            <div style={{ marginBottom: 22 }}>
                <Heading>Experience</Heading>
                {experience.length === 0 ? <Empty /> : experience.map((item, i) => (
                    <Entry
                        key={i}
                        title={item.position || '-'}
                        subtitle={[item.organization, item.joiningLocation].filter(Boolean).join(', ')}
                        right={dateRange(item.joiningDate, item.leavingDate)}
                        body={[item.CTC ? `CTC: ${item.CTC}` : '', joinTech(item.technologies)]
                            .filter(Boolean)
                            .join('  ·  ')}
                    />
                ))}
            </div>

            {/* Education */}
            <div style={{ marginBottom: 22 }}>
                <Heading>Education</Heading>
                {education.length === 0 ? <Empty /> : education.map((item, i) => (
                    <Entry
                        key={i}
                        title={item.degree || '-'}
                        subtitle={[item.institution, item.location].filter(Boolean).join(', ')}
                        right={dateRange(item.startYear, item.endYear, '')}
                        body={item.percentage ? `${item.percentage}%` : ''}
                    />
                ))}
            </div>

            {/* Projects */}
            <div style={{ marginBottom: 22 }}>
                <Heading>Projects</Heading>
                {project.length === 0 ? <Empty /> : project.map((item, i) => (
                    <Entry
                        key={i}
                        title={item.title || '-'}
                        subtitle={[item.teamSize ? `Team of ${item.teamSize}` : '', joinTech(item.technologies)]
                            .filter(Boolean)
                            .join('  ·  ')}
                        right={item.duration}
                        body={item.description}
                    />
                ))}
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 22 }}>
                <Heading>Skills</Heading>
                {skill.length === 0 ? <Empty /> : (
                    <div>
                        {skill.map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: font.itemSize,
                                    padding: '4px 0',
                                    borderBottom: '1px dotted #e0d5c2',
                                }}
                            >
                                <span>{item.skillName || '-'}</span>
                                <Dots level={item.level} />
                            </div>
                        ))}
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
                            textAlign: 'center',
                            marginBottom: 4,
                            wordBreak: 'break-word',
                        }}
                    >
                        <span style={{ fontWeight: 700 }}>{item.platform || 'Platform'}</span>
                        <span style={{ color: GOLD }}>{'  ·  '}</span>
                        <span style={{ color: '#4f4f4f' }}>{item.url || 'No URL'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ElegantTemplate;
