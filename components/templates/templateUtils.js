/**
 * Shared helpers for resume templates.
 *
 * Templates are captured by html2canvas, so they stick to plain inline styles.
 * Avoid CSS grid, flex `gap`, and backdrop filters here: html2canvas renders
 * them unreliably and the PDF would not match the on-screen preview.
 */

/** Merge fontConfig with per-template defaults. */
export const getFontConfig = (data, defaults = {}) => ({
    nameSize: data?.fontConfig?.nameSize || defaults.nameSize || 32,
    introSize: data?.fontConfig?.introSize || defaults.introSize || 14,
    contactSize: data?.fontConfig?.contactSize || defaults.contactSize || 12,
    headingSize: data?.fontConfig?.headingSize || defaults.headingSize || 15,
    headingAlign: ['left', 'center'].includes(data?.fontConfig?.headingAlign)
        ? data.fontConfig.headingAlign
        : defaults.headingAlign || 'left',
    itemSize: data?.fontConfig?.itemSize || defaults.itemSize || 13,
    minHeight: data?.fontConfig?.minHeight || defaults.minHeight || '950px',
    bodyFont: data?.fontConfig?.bodyFont || defaults.bodyFont || 'Arial, sans-serif',
});

/** "123 Main St, City, State - 123456", skipping the blanks. */
export const formatAddress = (basicDetails = {}) =>
    [
        basicDetails.address,
        basicDetails.city,
        basicDetails.state && basicDetails.pincode
            ? `${basicDetails.state} - ${basicDetails.pincode}`
            : basicDetails.state || basicDetails.pincode,
    ]
        .filter(Boolean)
        .join(', ');

/** technologies can arrive as an array or a comma string. */
export const joinTech = (technologies) =>
    Array.isArray(technologies) ? technologies.join(', ') : technologies || '';

/** "2020 - 2024", "2020 - Present", or "" when both are blank. */
export const dateRange = (from, to, fallbackTo = 'Present') => {
    if (!from && !to) return '';
    return `${from || '-'} - ${to || fallbackTo}`;
};

/** Clamp a skill level into a 0-100 bar width. */
export const levelToPercent = (level) => {
    const value = parseInt(level, 10);
    if (isNaN(value)) return 0;
    return Math.max(0, Math.min(100, value));
};
