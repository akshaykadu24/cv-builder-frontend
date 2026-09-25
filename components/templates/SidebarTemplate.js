import React from 'react';
import { dateRange, formatAddress, getFontConfig, joinTech, levelToPercent } from './templateUtils';

const SIDEBAR = '#1e293b';
const ACCENT = '#38bdf8';

/** Full-height dark profile sidebar with a clean white career column. */
const SidebarTemplate = ({ data }) => {
    const {
        basicDetails = {}, education = [], experience = [],
        project = [], skill = [], socialProfile = [],
    } = data || {};

    const font = getFontConfig(data, {
        nameSize: 30, headingSize: 15, itemSize: 12,
        bodyFont: 'Arial, Helvetica, sans-serif',
    });

    const MainHeading = ({ children }) => <div style={{
        fontSize: font.headingSize, fontWeight: 800, color: SIDEBAR,
        textAlign: font.headingAlign,
        textTransform: 'uppercase', letterSpacing: 1.3,
        borderBottom: `2px solid ${ACCENT}`, paddingBottom: 4, marginBottom: 11,
    }}>{children}</div>;

    const SideHeading = ({ children }) => <div style={{
        fontSize: font.headingSize - 1, fontWeight: 700, color: '#fff',
        textAlign: font.headingAlign,
        textTransform: 'uppercase', letterSpacing: 1.2,
        borderBottom: '1px solid #64748b', paddingBottom: 4, marginBottom: 9,
    }}>{children}</div>;

    const Empty = ({ dark = false }) => <div style={{ fontSize: font.itemSize, color: dark ? '#94a3b8' : '#9ca3af' }}>Not provided</div>;

    const MainEntry = ({ title, subtitle, right, meta, body }) => <div style={{ marginBottom: 13 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: font.itemSize + 1, fontWeight: 700, color: '#0f172a', paddingRight: 8 }}>{title}</div>
            {right ? <div style={{ fontSize: font.itemSize - 1, color: '#64748b', whiteSpace: 'nowrap' }}>{right}</div> : null}
        </div>
        {subtitle ? <div style={{ fontSize: font.itemSize, color: '#0284c7', fontWeight: 700, marginTop: 1 }}>{subtitle}</div> : null}
        {meta ? <div style={{ fontSize: font.itemSize - 0.5, color: '#64748b', marginTop: 2 }}>{meta}</div> : null}
        {body ? <div style={{ fontSize: font.itemSize, color: '#334155', lineHeight: 1.45, marginTop: 3 }}>{body}</div> : null}
    </div>;

    return <div style={{
        display: 'flex', maxWidth: 800, margin: '10px auto',
        minHeight: font.minHeight, fontFamily: font.bodyFont,
        color: '#1f2937', backgroundColor: '#fff', lineHeight: 1.3,
        border: '1px solid #cbd5e1', overflow: 'hidden',
    }}>
        <div style={{ width: '34%', backgroundColor: SIDEBAR, color: '#e2e8f0', padding: 22, minWidth: 0 }}>
            {basicDetails.image ? <div style={{ textAlign: 'center', marginBottom: 15 }}>
                <img src={basicDetails.image} alt="" style={{
                    width: 104, height: 104, objectFit: 'cover', borderRadius: '50%',
                    border: `4px solid ${ACCENT}`,
                }} />
            </div> : null}

            <div style={{ fontSize: font.nameSize, fontWeight: 800, color: '#fff', lineHeight: 1.1, wordBreak: 'break-word' }}>
                {basicDetails.name || 'Your Name'}
            </div>
            <div style={{ fontSize: font.introSize, color: '#cbd5e1', marginTop: 8, lineHeight: 1.45 }}>
                {basicDetails.intro || 'A short introduction about yourself goes here.'}
            </div>

            <div style={{ marginTop: 22 }}>
                <SideHeading>Contact</SideHeading>
                {[basicDetails.email || 'email@example.com', basicDetails.phone, formatAddress(basicDetails)].filter(Boolean).map((text, i) =>
                    <div key={i} style={{ fontSize: font.contactSize, lineHeight: 1.45, marginBottom: 7, wordBreak: 'break-word' }}>{text}</div>
                )}
            </div>

            <div style={{ marginTop: 22 }}>
                <SideHeading>Skills</SideHeading>
                {skill.length === 0 ? <Empty dark /> : skill.map((item, i) => <div key={i} style={{ marginBottom: 9 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: font.itemSize, marginBottom: 3 }}>
                        <span>{item.skillName || '-'}</span><span style={{ color: '#94a3b8' }}>{item.level ? `${item.level}%` : ''}</span>
                    </div>
                    <div style={{ height: 5, backgroundColor: '#475569', borderRadius: 3 }}>
                        <div style={{ height: 5, width: `${levelToPercent(item.level)}%`, backgroundColor: ACCENT, borderRadius: 3 }} />
                    </div>
                </div>)}
            </div>

            <div style={{ marginTop: 22 }}>
                <SideHeading>Profiles</SideHeading>
                {socialProfile.length === 0 ? <Empty dark /> : socialProfile.map((item, i) => <div key={i} style={{
                    fontSize: font.itemSize, marginBottom: 8, wordBreak: 'break-word',
                }}>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{item.platform || 'Platform'}</div>
                    <div style={{ color: ACCENT }}>{item.url || 'No URL'}</div>
                </div>)}
            </div>
        </div>

        <div style={{ width: '66%', padding: 24, minWidth: 0 }}>
            <div style={{ marginBottom: 22 }}>
                <MainHeading>Experience</MainHeading>
                {experience.length === 0 ? <Empty /> : experience.map((item, i) => <MainEntry
                    key={i} title={item.position || '-'} subtitle={item.organization || '-'}
                    right={dateRange(item.joiningDate, item.leavingDate)}
                    meta={[item.joiningLocation, item.CTC ? `CTC: ${item.CTC}` : '', joinTech(item.technologies)].filter(Boolean).join('  ·  ')}
                />)}
            </div>

            <div style={{ marginBottom: 22 }}>
                <MainHeading>Education</MainHeading>
                {education.length === 0 ? <Empty /> : education.map((item, i) => <MainEntry
                    key={i} title={item.degree || '-'} subtitle={item.institution || '-'}
                    right={dateRange(item.startYear, item.endYear, '')}
                    meta={[item.percentage ? `${item.percentage}%` : '', item.location].filter(Boolean).join('  ·  ')}
                />)}
            </div>

            <div>
                <MainHeading>Projects</MainHeading>
                {project.length === 0 ? <Empty /> : project.map((item, i) => <MainEntry
                    key={i} title={item.title || '-'} right={item.duration}
                    meta={[item.teamSize ? `Team of ${item.teamSize}` : '', joinTech(item.technologies)].filter(Boolean).join('  ·  ')}
                    body={item.description}
                />)}
            </div>
        </div>
    </div>;
};

export default SidebarTemplate;
