import React from 'react';
import { dateRange, formatAddress, getFontConfig, joinTech } from './templateUtils';

/** Traditional one-column resume with serif typography and conservative rules. */
const ClassicTemplate = ({ data }) => {
    const {
        basicDetails = {}, education = [], experience = [],
        project = [], skill = [], socialProfile = [],
    } = data || {};

    const font = getFontConfig(data, {
        nameSize: 34, headingSize: 15, itemSize: 13,
        bodyFont: 'Georgia, "Times New Roman", serif',
    });

    const Heading = ({ children }) => (
        <div style={{
            fontSize: font.headingSize, fontWeight: 700, color: '#1f2937',
            textAlign: font.headingAlign,
            textTransform: 'uppercase', letterSpacing: 1.4,
            borderBottom: '1px solid #9ca3af', paddingBottom: 4, marginBottom: 10,
        }}>
            {children}
        </div>
    );

    const Empty = () => <div style={{ fontSize: font.itemSize, color: '#9ca3af' }}>Not provided</div>;

    const Entry = ({ title, subtitle, right, meta, body }) => (
        <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: font.itemSize + 1, fontWeight: 700, paddingRight: 10 }}>{title}</div>
                {right ? <div style={{ fontSize: font.itemSize - 1, color: '#6b7280', whiteSpace: 'nowrap' }}>{right}</div> : null}
            </div>
            {subtitle ? <div style={{ fontSize: font.itemSize, fontStyle: 'italic', color: '#4b5563', marginTop: 1 }}>{subtitle}</div> : null}
            {meta ? <div style={{ fontSize: font.itemSize - 0.5, color: '#6b7280', marginTop: 2 }}>{meta}</div> : null}
            {body ? <div style={{ fontSize: font.itemSize, color: '#374151', lineHeight: 1.45, marginTop: 3 }}>{body}</div> : null}
        </div>
    );

    const address = formatAddress(basicDetails);
    const contact = [basicDetails.email || 'email@example.com', basicDetails.phone, address].filter(Boolean);

    return (
        <div style={{
            maxWidth: 750, margin: '10px auto', padding: 32,
            minHeight: font.minHeight, fontFamily: font.bodyFont,
            color: '#1f2937', backgroundColor: '#fff', lineHeight: 1.35,
            border: '1px solid #e5e7eb',
        }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                {basicDetails.image ? <img src={basicDetails.image} alt="" style={{
                    width: 88, height: 88, objectFit: 'cover', borderRadius: '50%',
                    border: '2px solid #374151', marginBottom: 10,
                }} /> : null}
                <div style={{ fontSize: font.nameSize, fontWeight: 700, letterSpacing: 1, lineHeight: 1.1 }}>
                    {basicDetails.name || 'Your Name'}
                </div>
                <div style={{ fontSize: font.introSize, color: '#4b5563', fontStyle: 'italic', marginTop: 6, lineHeight: 1.45 }}>
                    {basicDetails.intro || 'Brief professional summary or objective.'}
                </div>
                <div style={{ fontSize: font.contactSize, color: '#4b5563', marginTop: 8, lineHeight: 1.5 }}>
                    {contact.join('  ·  ')}
                </div>
            </div>

            <div style={{ borderTop: '2px solid #374151', marginBottom: 20 }} />

            <div style={{ marginBottom: 20 }}>
                <Heading>Experience</Heading>
                {experience.length === 0 ? <Empty /> : experience.map((item, i) => <Entry
                    key={i}
                    title={item.position || '-'}
                    subtitle={[item.organization, item.joiningLocation].filter(Boolean).join(', ')}
                    right={dateRange(item.joiningDate, item.leavingDate)}
                    meta={[item.CTC ? `CTC: ${item.CTC}` : '', joinTech(item.technologies)].filter(Boolean).join('  ·  ')}
                />)}
            </div>

            <div style={{ marginBottom: 20 }}>
                <Heading>Education</Heading>
                {education.length === 0 ? <Empty /> : education.map((item, i) => <Entry
                    key={i}
                    title={item.degree || '-'}
                    subtitle={[item.institution, item.location].filter(Boolean).join(', ')}
                    right={dateRange(item.startYear, item.endYear, '')}
                    meta={item.percentage ? `${item.percentage}%` : ''}
                />)}
            </div>

            <div style={{ marginBottom: 20 }}>
                <Heading>Projects</Heading>
                {project.length === 0 ? <Empty /> : project.map((item, i) => <Entry
                    key={i}
                    title={item.title || '-'}
                    right={item.duration}
                    meta={[item.teamSize ? `Team of ${item.teamSize}` : '', joinTech(item.technologies)].filter(Boolean).join('  ·  ')}
                    body={item.description}
                />)}
            </div>

            <div style={{ marginBottom: 20 }}>
                <Heading>Skills</Heading>
                {skill.length === 0 ? <Empty /> : <div style={{ fontSize: font.itemSize, lineHeight: 1.7 }}>
                    {skill.map((item) => `${item.skillName || '-'}${item.level ? ` (${item.level}%)` : ''}`).join('  ·  ')}
                </div>}
            </div>

            <div>
                <Heading>Social Profiles</Heading>
                {socialProfile.length === 0 ? <Empty /> : socialProfile.map((item, i) => <div key={i} style={{
                    fontSize: font.itemSize, marginBottom: 4, wordBreak: 'break-word',
                }}>
                    <strong>{item.platform || 'Platform'}:</strong> {item.url || 'No URL'}
                </div>)}
            </div>
        </div>
    );
};

export default ClassicTemplate;
