import React from 'react';
import { dateRange, formatAddress, getFontConfig, joinTech, levelToPercent } from './templateUtils';

const COLORS = {
    purple: '#6d28d9',
    violet: '#8b5cf6',
    coral: '#f97316',
    teal: '#0d9488',
    blue: '#2563eb',
    yellow: '#fbbf24',
    ink: '#1f2937',
};

/**
 * Color Pop: a vibrant, professional two-column layout. Each section has its
 * own accent while the purple header ties the page together.
 */
const ColorfulTemplate = ({ data }) => {
    const {
        basicDetails = {}, education = [], experience = [],
        project = [], skill = [], socialProfile = [],
    } = data || {};

    const font = getFontConfig(data, {
        nameSize: 34, headingSize: 14, itemSize: 12,
        bodyFont: 'Arial, Helvetica, sans-serif',
    });

    const Heading = ({ children, color }) => (
        font.headingAlign === 'center' ? (
            <div style={{ textAlign: 'center', marginBottom: 11 }}>
                <div style={{ fontSize: font.headingSize, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                    {children}
                </div>
                <div style={{ width: 44, height: 2, backgroundColor: color, margin: '4px auto 0' }} />
            </div>
        ) : (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, marginRight: 8 }} />
                <div style={{ fontSize: font.headingSize, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                    {children}
                </div>
                <div style={{ height: 2, flex: 1, backgroundColor: color, opacity: 0.25, marginLeft: 9 }} />
            </div>
        )
    );

    const Empty = () => <div style={{ fontSize: font.itemSize, color: '#9ca3af' }}>Not provided</div>;

    const Entry = ({ title, subtitle, right, meta, body, color }) => (
        <div style={{
            borderLeft: `3px solid ${color}`, paddingLeft: 10,
            marginBottom: 13, pageBreakInside: 'avoid',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: font.itemSize + 1, fontWeight: 800, color: COLORS.ink, paddingRight: 8 }}>
                    {title}
                </div>
                {right ? <div style={{ fontSize: font.itemSize - 1, color, fontWeight: 700, whiteSpace: 'nowrap' }}>{right}</div> : null}
            </div>
            {subtitle ? <div style={{ fontSize: font.itemSize, color, fontWeight: 700, marginTop: 1 }}>{subtitle}</div> : null}
            {meta ? <div style={{ fontSize: font.itemSize - 0.5, color: '#64748b', marginTop: 2 }}>{meta}</div> : null}
            {body ? <div style={{ fontSize: font.itemSize, color: '#374151', lineHeight: 1.45, marginTop: 4 }}>{body}</div> : null}
        </div>
    );

    const contact = [basicDetails.email || 'email@example.com', basicDetails.phone, formatAddress(basicDetails)].filter(Boolean);

    return (
        <div style={{
            maxWidth: 800, margin: '10px auto', minHeight: font.minHeight,
            fontFamily: font.bodyFont, color: COLORS.ink, backgroundColor: '#fff',
            lineHeight: 1.3, border: '1px solid #e5e7eb', overflow: 'hidden',
        }}>
            {/* Purple header with coral/yellow decorative blocks */}
            <div style={{ position: 'relative', backgroundColor: COLORS.purple, color: '#fff', padding: 26, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: 125, height: 125, borderRadius: '50%', backgroundColor: COLORS.coral, top: -74, right: -20, opacity: 0.9 }} />
                <div style={{ position: 'absolute', width: 70, height: 70, borderRadius: '50%', backgroundColor: COLORS.yellow, bottom: -49, right: 100, opacity: 0.85 }} />

                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    {basicDetails.image ? <img src={basicDetails.image} alt="" style={{
                        width: 96, height: 96, objectFit: 'cover', borderRadius: 18,
                        border: '4px solid #fff', marginRight: 20, flexShrink: 0,
                        boxShadow: '0 5px 14px rgba(0,0,0,.2)',
                    }} /> : null}
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: font.nameSize, fontWeight: 800, lineHeight: 1.08, letterSpacing: 0.3 }}>
                            {basicDetails.name || 'Your Name'}
                        </div>
                        <div style={{ fontSize: font.introSize, color: '#ede9fe', marginTop: 7, lineHeight: 1.45 }}>
                            {basicDetails.intro || 'A short introduction about yourself goes here.'}
                        </div>
                        <div style={{ fontSize: font.contactSize, color: '#fef3c7', marginTop: 9, lineHeight: 1.55 }}>
                            {contact.join('  ·  ')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Four-colour strip */}
            <div style={{ display: 'flex', height: 7 }}>
                {[COLORS.coral, COLORS.yellow, COLORS.teal, COLORS.blue].map((color) => (
                    <div key={color} style={{ flex: 1, backgroundColor: color }} />
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'stretch' }}>
                {/* Main column */}
                <div style={{ width: '64%', padding: 22, minWidth: 0 }}>
                    <div style={{ marginBottom: 22 }}>
                        <Heading color={COLORS.purple}>Experience</Heading>
                        {experience.length === 0 ? <Empty /> : experience.map((item, i) => <Entry
                            key={i} color={COLORS.purple}
                            title={item.position || '-'}
                            subtitle={[item.organization, item.joiningLocation].filter(Boolean).join(', ')}
                            right={dateRange(item.joiningDate, item.leavingDate)}
                            meta={[item.CTC ? `CTC: ${item.CTC}` : '', joinTech(item.technologies)].filter(Boolean).join('  ·  ')}
                        />)}
                    </div>

                    <div>
                        <Heading color={COLORS.coral}>Projects</Heading>
                        {project.length === 0 ? <Empty /> : project.map((item, i) => <Entry
                            key={i} color={COLORS.coral}
                            title={item.title || '-'} right={item.duration}
                            meta={[item.teamSize ? `Team of ${item.teamSize}` : '', joinTech(item.technologies)].filter(Boolean).join('  ·  ')}
                            body={item.description}
                        />)}
                    </div>
                </div>

                {/* Pale rail */}
                <div style={{ width: '36%', padding: 20, minWidth: 0, backgroundColor: '#faf5ff', borderLeft: '1px solid #ede9fe' }}>
                    <div style={{ marginBottom: 22 }}>
                        <Heading color={COLORS.blue}>Education</Heading>
                        {education.length === 0 ? <Empty /> : education.map((item, i) => <div key={i} style={{ marginBottom: 11 }}>
                            <div style={{ fontSize: font.itemSize + 0.5, fontWeight: 800 }}>{item.degree || '-'}</div>
                            <div style={{ fontSize: font.itemSize, color: COLORS.blue, fontWeight: 700, marginTop: 1 }}>{item.institution || '-'}</div>
                            <div style={{ fontSize: font.itemSize - 1, color: '#64748b', marginTop: 2 }}>
                                {[dateRange(item.startYear, item.endYear, ''), item.percentage ? `${item.percentage}%` : '', item.location].filter(Boolean).join('  ·  ')}
                            </div>
                        </div>)}
                    </div>

                    <div style={{ marginBottom: 22 }}>
                        <Heading color={COLORS.teal}>Skills</Heading>
                        {skill.length === 0 ? <Empty /> : skill.map((item, i) => <div key={i} style={{ marginBottom: 9 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: font.itemSize, marginBottom: 3 }}>
                                <strong>{item.skillName || '-'}</strong>
                                <span style={{ color: COLORS.teal, fontWeight: 700 }}>{item.level ? `${item.level}%` : ''}</span>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, backgroundColor: '#ccfbf1' }}>
                                <div style={{ width: `${levelToPercent(item.level)}%`, height: 6, borderRadius: 3, backgroundColor: COLORS.teal }} />
                            </div>
                        </div>)}
                    </div>

                    <div>
                        <Heading color={COLORS.coral}>Profiles</Heading>
                        {socialProfile.length === 0 ? <Empty /> : socialProfile.map((item, i) => <div key={i} style={{
                            fontSize: font.itemSize - 0.5, backgroundColor: '#fff7ed',
                            borderLeft: `3px solid ${COLORS.coral}`, borderRadius: 3,
                            padding: 7, marginBottom: 7, wordBreak: 'break-word',
                        }}>
                            <div style={{ fontWeight: 800, color: COLORS.coral }}>{item.platform || 'Platform'}</div>
                            <div style={{ color: '#475569', marginTop: 1 }}>{item.url || 'No URL'}</div>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorfulTemplate;
