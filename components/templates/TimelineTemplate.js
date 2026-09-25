import React from 'react';
import { dateRange, formatAddress, getFontConfig, joinTech, levelToPercent } from './templateUtils';

const ACCENT = '#0f766e';

/**
 * Timeline: history sections run down a vertical rail with a dot per entry.
 *
 * The rail is built from a fixed-width flex cell with a left border rather than
 * absolutely positioned pseudo-elements, since html2canvas renders plain boxes
 * far more predictably than pseudo-elements.
 */
const TimelineTemplate = ({ data }) => {
    const {
        basicDetails = {},
        education = [],
        experience = [],
        project = [],
        skill = [],
        socialProfile = [],
    } = data || {};

    const font = getFontConfig(data, {
        nameSize: 32,
        headingSize: 14,
        itemSize: 12.5,
        bodyFont: 'Verdana, Geneva, sans-serif',
    });

    const Heading = ({ children }) => (
        <div
            style={{
                fontSize: font.headingSize,
                fontWeight: 700,
                textAlign: font.headingAlign,
                color: ACCENT,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                marginBottom: 12,
            }}
        >
            {children}
        </div>
    );

    const Empty = () => (
        <div style={{ fontSize: font.itemSize, color: '#9ca3af', paddingLeft: 26 }}>Not provided</div>
    );

    /** One timeline row: rail cell on the left, content on the right. */
    const Entry = ({ title, right, metaLines = [], body, isLast }) => (
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
            <div
                style={{
                    width: 26,
                    flexShrink: 0,
                    borderLeft: isLast ? '2px solid transparent' : `2px solid #cbd5e1`,
                    position: 'relative',
                    paddingTop: 3,
                }}
            >
                <div
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: ACCENT,
                        marginLeft: -6,
                        border: '2px solid #fff',
                    }}
                />
            </div>

            <div style={{ paddingBottom: isLast ? 0 : 16, paddingLeft: 4, flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: font.itemSize + 1, fontWeight: 700, color: '#0f172a', paddingRight: 8 }}>
                        {title}
                    </div>
                    {right ? (
                        <div
                            style={{
                                fontSize: font.itemSize - 1.5,
                                color: ACCENT,
                                whiteSpace: 'nowrap',
                                fontWeight: 700,
                            }}
                        >
                            {right}
                        </div>
                    ) : null}
                </div>
                {metaLines.filter(Boolean).map((line, i) => (
                    <div key={i} style={{ fontSize: font.itemSize - 0.5, color: '#64748b', marginTop: 2 }}>
                        {line}
                    </div>
                ))}
                {body ? (
                    <div style={{ fontSize: font.itemSize, color: '#334155', marginTop: 4, lineHeight: 1.5 }}>
                        {body}
                    </div>
                ) : null}
            </div>
        </div>
    );

    return (
        <div
            style={{
                fontFamily: font.bodyFont,
                backgroundColor: '#ffffff',
                color: '#0f172a',
                maxWidth: 780,
                margin: '10px auto',
                lineHeight: 1.3,
                minHeight: font.minHeight,
                border: '1px solid #e2e8f0',
            }}
        >
            {/* Header band */}
            <div
                style={{
                    backgroundColor: '#f0fdfa',
                    borderBottom: `3px solid ${ACCENT}`,
                    padding: 24,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {basicDetails.image ? (
                    <img
                        src={basicDetails.image}
                        alt=""
                        style={{
                            width: 84,
                            height: 84,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: `3px solid ${ACCENT}`,
                            marginRight: 18,
                            flexShrink: 0,
                        }}
                    />
                ) : null}

                <div style={{ minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: font.nameSize,
                            fontWeight: 700,
                            color: '#134e4a',
                            lineHeight: 1.1,
                        }}
                    >
                        {basicDetails.name || 'Your Name'}
                    </div>
                    <div
                        style={{
                            fontSize: font.introSize,
                            color: '#0f766e',
                            fontStyle: 'italic',
                            marginTop: 6,
                            lineHeight: 1.4,
                        }}
                    >
                        {basicDetails.intro || 'A short introduction about yourself goes here.'}
                    </div>
                    <div style={{ fontSize: font.contactSize, color: '#475569', marginTop: 8, lineHeight: 1.5 }}>
                        {[basicDetails.email || 'email@example.com', basicDetails.phone, formatAddress(basicDetails)]
                            .filter(Boolean)
                            .join('  |  ')}
                    </div>
                </div>
            </div>

            <div style={{ padding: 24 }}>
                {/* Experience */}
                <div style={{ marginBottom: 24 }}>
                    <Heading>Experience</Heading>
                    {experience.length === 0 ? <Empty /> : experience.map((item, i) => (
                        <Entry
                            key={i}
                            isLast={i === experience.length - 1}
                            title={item.position || '-'}
                            right={dateRange(item.joiningDate, item.leavingDate)}
                            metaLines={[
                                [item.organization, item.joiningLocation].filter(Boolean).join(', '),
                                [item.CTC ? `CTC: ${item.CTC}` : '', joinTech(item.technologies)]
                                    .filter(Boolean)
                                    .join('  ·  '),
                            ]}
                        />
                    ))}
                </div>

                {/* Education */}
                <div style={{ marginBottom: 24 }}>
                    <Heading>Education</Heading>
                    {education.length === 0 ? <Empty /> : education.map((item, i) => (
                        <Entry
                            key={i}
                            isLast={i === education.length - 1}
                            title={item.degree || '-'}
                            right={dateRange(item.startYear, item.endYear, '')}
                            metaLines={[
                                [item.institution, item.location].filter(Boolean).join(', '),
                                item.percentage ? `${item.percentage}%` : '',
                            ]}
                        />
                    ))}
                </div>

                {/* Projects */}
                <div style={{ marginBottom: 24 }}>
                    <Heading>Projects</Heading>
                    {project.length === 0 ? <Empty /> : project.map((item, i) => (
                        <Entry
                            key={i}
                            isLast={i === project.length - 1}
                            title={item.title || '-'}
                            right={item.duration}
                            metaLines={[
                                [item.teamSize ? `Team of ${item.teamSize}` : '', joinTech(item.technologies)]
                                    .filter(Boolean)
                                    .join('  ·  '),
                            ]}
                            body={item.description}
                        />
                    ))}
                </div>

                {/* Skills as bars */}
                <div style={{ marginBottom: 24 }}>
                    <Heading>Skills</Heading>
                    {skill.length === 0 ? (
                        <div style={{ fontSize: font.itemSize, color: '#9ca3af' }}>Not provided</div>
                    ) : skill.map((item, i) => (
                        <div key={i} style={{ marginBottom: 9 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: font.itemSize,
                                    marginBottom: 3,
                                }}
                            >
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.skillName || '-'}</span>
                                <span style={{ color: '#64748b' }}>{item.level ? `${item.level}%` : ''}</span>
                            </div>
                            <div style={{ height: 6, backgroundColor: '#e2e8f0', borderRadius: 3 }}>
                                <div
                                    style={{
                                        height: 6,
                                        width: `${levelToPercent(item.level)}%`,
                                        backgroundColor: ACCENT,
                                        borderRadius: 3,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Social */}
                <div>
                    <Heading>Profiles</Heading>
                    {socialProfile.length === 0 ? (
                        <div style={{ fontSize: font.itemSize, color: '#9ca3af' }}>Not provided</div>
                    ) : socialProfile.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                fontSize: font.itemSize,
                                color: '#334155',
                                marginBottom: 4,
                                wordBreak: 'break-word',
                            }}
                        >
                            <span style={{ fontWeight: 700, color: ACCENT }}>{item.platform || 'Platform'}: </span>
                            {item.url || 'No URL'}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineTemplate;
