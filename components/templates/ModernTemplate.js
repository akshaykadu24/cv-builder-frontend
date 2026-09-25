import React from 'react';
import { dateRange, formatAddress, getFontConfig, joinTech, levelToPercent } from './templateUtils';

const BLUE = '#1d4ed8';
const NAVY = '#172554';

/** Modern resume with a strong blue header, cards, tags and skill bars. */
const ModernTemplate = ({ data }) => {
    const {
        basicDetails = {}, education = [], experience = [],
        project = [], skill = [], socialProfile = [],
    } = data || {};

    const font = getFontConfig(data, {
        nameSize: 34, headingSize: 15, itemSize: 12.5,
        bodyFont: 'Arial, Helvetica, sans-serif',
    });

    const Heading = ({ children }) => <div style={{
        fontSize: font.headingSize, fontWeight: 800, color: NAVY,
        textAlign: font.headingAlign,
        textTransform: 'uppercase', letterSpacing: 1.2,
        borderLeft: `4px solid ${BLUE}`, paddingLeft: 9, marginBottom: 11,
    }}>{children}</div>;

    const Empty = () => <div style={{ fontSize: font.itemSize, color: '#94a3b8' }}>Not provided</div>;

    const Entry = ({ title, subtitle, right, meta, body }) => <div style={{
        backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
        borderRadius: 6, padding: 11, marginBottom: 9,
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: font.itemSize + 1, fontWeight: 700, color: '#0f172a', paddingRight: 8 }}>{title}</div>
            {right ? <div style={{ fontSize: font.itemSize - 1, color: BLUE, fontWeight: 700, whiteSpace: 'nowrap' }}>{right}</div> : null}
        </div>
        {subtitle ? <div style={{ fontSize: font.itemSize, color: '#475569', marginTop: 2 }}>{subtitle}</div> : null}
        {meta ? <div style={{ fontSize: font.itemSize - 0.5, color: '#64748b', marginTop: 3 }}>{meta}</div> : null}
        {body ? <div style={{ fontSize: font.itemSize, color: '#334155', lineHeight: 1.45, marginTop: 4 }}>{body}</div> : null}
    </div>;

    const contact = [basicDetails.email || 'email@example.com', basicDetails.phone, formatAddress(basicDetails)].filter(Boolean);

    return <div style={{
        maxWidth: 780, margin: '10px auto', minHeight: font.minHeight,
        fontFamily: font.bodyFont, backgroundColor: '#fff', color: '#1e293b',
        lineHeight: 1.3, border: '1px solid #dbeafe',
    }}>
        <div style={{
            padding: 24, color: '#fff', backgroundColor: NAVY,
            display: 'flex', alignItems: 'center', borderBottom: `5px solid ${BLUE}`,
        }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: font.nameSize, fontWeight: 800, lineHeight: 1.1, letterSpacing: 0.4 }}>
                    {basicDetails.name || 'Your Name'}
                </div>
                <div style={{ fontSize: font.introSize, color: '#bfdbfe', marginTop: 6, lineHeight: 1.45 }}>
                    {basicDetails.intro || 'A short introduction about yourself goes here.'}
                </div>
                <div style={{ fontSize: font.contactSize, color: '#e0e7ff', marginTop: 9, lineHeight: 1.55 }}>
                    {contact.join('  ·  ')}
                </div>
            </div>
            {basicDetails.image ? <img src={basicDetails.image} alt="" style={{
                width: 88, height: 88, objectFit: 'cover', borderRadius: 10,
                border: '3px solid #60a5fa', marginLeft: 18, flexShrink: 0,
            }} /> : null}
        </div>

        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 22 }}>
                <Heading>Experience</Heading>
                {experience.length === 0 ? <Empty /> : experience.map((item, i) => <Entry
                    key={i} title={item.position || '-'}
                    subtitle={[item.organization, item.joiningLocation].filter(Boolean).join(', ')}
                    right={dateRange(item.joiningDate, item.leavingDate)}
                    meta={[item.CTC ? `CTC: ${item.CTC}` : '', joinTech(item.technologies)].filter(Boolean).join('  ·  ')}
                />)}
            </div>

            <div style={{ marginBottom: 22 }}>
                <Heading>Projects</Heading>
                {project.length === 0 ? <Empty /> : project.map((item, i) => <Entry
                    key={i} title={item.title || '-'} right={item.duration}
                    meta={[item.teamSize ? `Team of ${item.teamSize}` : '', joinTech(item.technologies)].filter(Boolean).join('  ·  ')}
                    body={item.description}
                />)}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ width: '52%', paddingRight: 12 }}>
                    <Heading>Education</Heading>
                    {education.length === 0 ? <Empty /> : education.map((item, i) => <div key={i} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: font.itemSize + 0.5, fontWeight: 700 }}>{item.degree || '-'}</div>
                        <div style={{ fontSize: font.itemSize, color: '#475569' }}>{item.institution || '-'}</div>
                        <div style={{ fontSize: font.itemSize - 1, color: '#64748b', marginTop: 2 }}>
                            {[dateRange(item.startYear, item.endYear, ''), item.percentage ? `${item.percentage}%` : '', item.location].filter(Boolean).join('  ·  ')}
                        </div>
                    </div>)}
                </div>

                <div style={{ width: '48%', paddingLeft: 12, borderLeft: '1px solid #e2e8f0' }}>
                    <Heading>Skills</Heading>
                    {skill.length === 0 ? <Empty /> : skill.map((item, i) => <div key={i} style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: font.itemSize, marginBottom: 3 }}>
                            <strong>{item.skillName || '-'}</strong><span style={{ color: '#64748b' }}>{item.level ? `${item.level}%` : ''}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, backgroundColor: '#dbeafe' }}>
                            <div style={{ width: `${levelToPercent(item.level)}%`, height: 6, borderRadius: 3, backgroundColor: BLUE }} />
                        </div>
                    </div>)}
                </div>
            </div>

            <div style={{ marginTop: 22 }}>
                <Heading>Social Profiles</Heading>
                {socialProfile.length === 0 ? <Empty /> : <div>
                    {socialProfile.map((item, i) => <span key={i} style={{
                        display: 'inline-block', fontSize: font.itemSize, color: BLUE,
                        backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
                        borderRadius: 12, padding: '4px 9px', marginRight: 7, marginBottom: 6,
                    }}><strong>{item.platform || 'Platform'}:</strong> {item.url || 'No URL'}</span>)}
                </div>}
            </div>
        </div>
    </div>;
};

export default ModernTemplate;
