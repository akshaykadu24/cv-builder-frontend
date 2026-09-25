import ClassicTemplate from './ClassicTemplate';
import ColorfulTemplate from './ColorfulTemplate';
import CompactTemplate from './CompactTemplate';
import ElegantTemplate from './ElegantTemplate';
import MinimalTemplate from './MinimalTemplate';
import ModernTemplate from './ModernTemplate';
import SidebarTemplate from './SidebarTemplate';
import SimpleModernTemplate from './SimpleModernTemplate';
import TimelineTemplate from './TimelineTemplate';

/**
 * Single source of truth for templates, used by both the editor dropdown and
 * the /layout gallery so the two can't drift apart.
 *
 * `value` is what gets stored on formData.template and put in the URL, so
 * existing values ('classic', 'modern', 'sidebar') must not change.
 */
export const TEMPLATES = [
    {
        value: 'classic',
        label: 'Classic',
        description: 'Centred serif header, traditional and safe.',
        Component: ClassicTemplate,
    },
    {
        value: 'modern',
        label: 'Modern',
        description: 'Bold navy header, blue cards, tags and skill bars.',
        Component: ModernTemplate,
    },
    {
        value: 'simple-modern',
        label: 'Simple Modern',
        description: 'The original clean grey-and-blue Modern design.',
        Component: SimpleModernTemplate,
    },
    {
        value: 'sidebar',
        label: 'Sidebar',
        description: 'Full-height dark sidebar for contact and profiles.',
        Component: SidebarTemplate,
    },
    {
        value: 'minimal',
        label: 'Minimal',
        description: 'Black and white, hairline rules. Best for ATS parsing.',
        Component: MinimalTemplate,
    },
    {
        value: 'timeline',
        label: 'Timeline',
        description: 'Vertical rail with dated milestones and skill bars.',
        Component: TimelineTemplate,
    },
    {
        value: 'compact',
        label: 'Compact',
        description: 'Dark header band over a dense two-column body.',
        Component: CompactTemplate,
    },
    {
        value: 'color-pop',
        label: 'Color Pop',
        description: 'Purple, coral and teal accents in a vibrant two-column layout.',
        Component: ColorfulTemplate,
    },
    {
        value: 'elegant',
        label: 'Elegant',
        description: 'Cream page, gold rules, skills rated out of five.',
        Component: ElegantTemplate,
    },
];

/** Falls back to Classic for unknown values, matching the previous behaviour. */
export const getTemplateComponent = (value) =>
    TEMPLATES.find((template) => template.value === value)?.Component || ClassicTemplate;

/** Just the bits TemplateSelect needs. */
export const TEMPLATE_OPTIONS = TEMPLATES.map(({ value, label }) => ({ value, label }));
