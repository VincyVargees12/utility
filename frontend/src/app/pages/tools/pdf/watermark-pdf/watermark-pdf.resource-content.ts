import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const WATERMARK_PDF_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Watermark PDF',

  whatIsTitle: 'What is a PDF Watermark?',
  whatIsBody: [
    'A watermark is text or an image stamped onto every page of a document — commonly used to mark a file as "CONFIDENTIAL" or "DRAFT", to brand a document with a company logo, or to discourage unauthorized copying and redistribution.',
    'Unlike a signature or annotation, a watermark is typically drawn at low opacity so it sits behind or blends with the existing page content instead of obscuring it, and it\'s applied uniformly across the pages you choose.'
  ],

  whatIsToolTitle: 'What is this Watermark PDF tool?',
  whatIsToolBody: [
    'This is a browser-based tool for stamping a text or image watermark onto PDF pages. Upload one or more PDFs, choose a text watermark (with custom color, font, and size) or upload your own logo image, then fine-tune its position, rotation, opacity, and margin with a live preview.',
    'The same watermark settings are applied to every uploaded file when you download. Everything runs locally using pdf-lib, so your files are never uploaded to a server.'
  ],

  whyUseTitle: 'Why Watermark a PDF?',
  whyUseItems: [
    'Mark drafts and confidential documents — stamp "DRAFT" or "CONFIDENTIAL" across a page before it\'s shared outside your team.',
    'Brand a document — add a company logo or name to reports, proposals, or invoices before distributing them.',
    'Protect against unauthorized use — a visible watermark discourages a document from being copied and passed off as someone else\'s work.',
    'Track document copies — a subtle, identifying watermark can help trace where a leaked copy of a document originated.',
    'Prepare sample or preview documents — watermark a preview version of a paid document (e.g. "SAMPLE") before the final is delivered.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Add a text watermark with custom color, font, size, and bold styling',
    'Add an image or logo watermark from a PNG or JPG file',
    'Position the watermark using a 3x3 grid (corners, edges, or center)',
    'Control opacity, rotation angle, and edge margin, all with a live preview',
    'Apply the watermark to every page, or just the first page',
    'Upload and watermark multiple PDF files at once, downloaded as a zip',
    'Runs entirely in your browser — your PDFs are never uploaded to a server'
  ],

  howToTitle: 'How to Add a Watermark to a PDF',
  howTo: [
    { title: 'Upload your PDFs', description: 'Click to select or drag and drop one or more PDF files onto the upload area.' },
    { title: 'Choose text or image', description: 'Pick a text watermark and type your message, or upload a logo/image to use instead.' },
    { title: 'Adjust the look', description: 'Set the position, opacity, rotation, and size using the live preview until the watermark looks right.' },
    { title: 'Download the result', description: 'Click "Download" to apply the watermark to every uploaded file and save the result — a single PDF, or a zip if you uploaded more than one.' }
  ],

  commonErrorsTitle: 'Common Watermark PDF Errors and Pitfalls',
  commonErrors: [
    { title: 'Watermark too dark or too light', description: 'A high opacity can obscure the underlying text, while a very low opacity can be hard to notice — 30-50% is a good starting point for most documents.' },
    { title: 'Text watermark clipped at the edges', description: 'A long watermark message combined with a large text size can extend past the page edge, especially near a corner position — try a shorter message, a smaller size, or a center position.' },
    { title: 'Encrypted PDF is skipped', description: 'Password-protected PDFs can\'t be watermarked directly and are skipped during processing. Remove the password first using the Unlock PDF tool, then watermark the unlocked file.' },
    { title: 'Logo watermark looks stretched', description: 'The image watermark keeps its original aspect ratio based on width, so an unusually shaped logo may look different than expected — crop it to the proportions you want beforehand.' },
    { title: 'Watermark missing from some pages', description: 'If "Apply to every page" is unchecked, only the first page receives the watermark — check the box if you need it on every page.' }
  ],

  examplesTitle: 'Watermark PDF Example',
  examples: [
    {
      title: 'Marking a draft as confidential',
      description: 'A diagonal, semi-transparent text stamp across every page.',
      input: 'report.pdf, text "CONFIDENTIAL", 45° rotation, center position, 40% opacity',
      output: 'report-watermarked.pdf, every page stamped "CONFIDENTIAL" diagonally'
    },
    {
      title: 'Branding a document with a logo',
      description: 'A small logo placed in a corner of every page.',
      input: 'proposal.pdf, logo.png, bottom-right position, 20% size, 70% opacity',
      output: 'proposal-watermarked.pdf, logo stamped in the bottom-right of every page'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Watermarking happens entirely in your browser using pdf-lib. Your PDF files are never sent to a server.' },
    { question: 'Can I watermark with both text and an image at once?', answer: 'Not in a single pass — choose either a text or an image watermark per run. To apply both, watermark the file once with text, download it, then upload the result and watermark it again with an image.' },
    { question: 'What image formats are supported for a logo watermark?', answer: 'PNG and JPG. PNG is recommended if your logo has transparency, since it will be preserved.' },
    { question: 'What happens if I upload multiple files?', answer: 'The same watermark settings are applied to every file, and all watermarked files are downloaded together as a single zip.' },
    { question: 'Can I watermark a password-protected PDF?', answer: 'Not directly — use the Unlock PDF tool to remove the password first, then watermark the unlocked file.' },
    { question: 'Does the watermark reduce the quality of my PDF?', answer: 'No. The original page content is left untouched — the watermark is drawn on top as an additional layer.' }
  ]
};
