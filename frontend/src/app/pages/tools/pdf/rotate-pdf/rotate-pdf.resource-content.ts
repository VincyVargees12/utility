import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const ROTATE_PDF_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Rotate PDF',

  whatIsTitle: 'What is PDF Rotation?',
  whatIsBody: [
    'PDF rotation changes the orientation in which a page is displayed and printed — typically in 90-degree increments — without altering the underlying content. A page scanned sideways or upside-down can be rotated so it reads correctly, without needing to rescan or re-create the document.',
    'Rotation is stored as metadata on each page (a rotation angle) rather than by physically transforming the content, which is why it\'s fast and completely lossless — the original text and images are untouched, only the display orientation changes.'
  ],

  whatIsToolTitle: 'What is this Rotate PDF tool?',
  whatIsToolBody: [
    'This is a browser-based tool for fixing the orientation of PDF pages. Upload one or more PDFs, hover over a file to reveal rotate icons, and rotate each document 90 degrees left or right — repeat as needed to reach the correct orientation.',
    'Multiple PDFs can be uploaded and rotated independently, each with its own rotation angle tracked individually. When you process the rotation, all files are combined into a single output PDF with the chosen rotations applied to every page. Everything runs locally using pdf-lib, so your files are never uploaded to a server.'
  ],

  whyUseTitle: 'Why Rotate a PDF?',
  whyUseItems: [
    'Fix sideways scans — correct pages that were scanned in landscape when they should read in portrait, or vice versa.',
    'Straighten upside-down pages — flip a page that was fed into a scanner backward so it reads right-side up.',
    'Standardize orientation across a document — make every page in a mixed-orientation scan consistent for easier reading.',
    'Prepare a document for printing — ensure pages are oriented correctly before sending a document to a printer.',
    'Correct camera-captured documents — fix the orientation of a PDF created from photos taken with a phone at an angle.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Rotate PDF pages 90 degrees left or right, repeatable for any angle',
    'Upload and rotate multiple PDF files independently in one session',
    'Hover-to-reveal rotate controls directly on each file thumbnail',
    'Live thumbnail preview showing the current rotation of each file',
    'Shows page count for every uploaded document',
    'Combines all rotated files into a single output PDF when downloading',
    'Runs entirely in your browser — your PDFs are never uploaded to a server'
  ],

  howToTitle: 'How to Rotate a PDF File',
  howTo: [
    { title: 'Upload your PDFs', description: 'Click to select or drag and drop one or more PDF files onto the upload area.' },
    { title: 'Preview the current orientation', description: 'Each file appears as a thumbnail so you can see how it\'s currently oriented.' },
    { title: 'Rotate as needed', description: 'Use the "RIGHT" and "LEFT" rotation buttons in the sidebar (or hover over a file and use its rotate icons) to rotate 90 degrees at a time until the orientation looks correct.' },
    { title: 'Download the rotated PDF', description: 'Click "Download Rotated PDF" to apply the rotation to every page and save the corrected document.' }
  ],

  commonErrorsTitle: 'Common Rotate PDF Errors and Pitfalls',
  commonErrors: [
    { title: 'Rotating the wrong number of times', description: 'Since rotation moves in 90-degree steps, it\'s easy to overshoot — if a page ends up upside-down, you\'ve rotated it 180 degrees off; two more clicks in the same direction (or two in the opposite direction) will correct it.' },
    { title: 'Expecting only some pages to rotate', description: 'Rotation currently applies to every page of a given file at once — if only some pages need correcting, first use the Split PDF tool to separate them, rotate that file, then merge everything back together.' },
    { title: 'Multiple files merging unexpectedly', description: 'When more than one file is uploaded, downloading combines them into a single output PDF — if you need each file to stay separate, rotate and download them one at a time instead of uploading them together.' },
    { title: 'Encrypted PDF fails to rotate', description: 'Password-protected PDFs may not process correctly. Remove the password first using the Unlock PDF tool, then rotate.' },
    { title: 'Thumbnail not updating visually', description: 'On some files the preview thumbnail may take a moment to reflect a new rotation while it re-renders — the applied rotation is still tracked correctly and will be reflected in the final download.' }
  ],

  examplesTitle: 'Rotate PDF Example',
  examples: [
    {
      title: 'Correcting a sideways scan',
      description: 'A page scanned in landscape that needs to read in portrait.',
      input: 'scanned-form.pdf, rotated 90° right once',
      output: 'scanned-form-rotated.pdf, pages now display upright'
    },
    {
      title: 'Fixing an upside-down document',
      description: 'A page fed into the scanner backward.',
      input: 'invoice.pdf, rotated 90° right twice (180° total)',
      output: 'invoice-rotated.pdf, pages now read correctly instead of upside-down'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Rotation happens entirely in your browser using pdf-lib. Your PDF files are never sent to a server.' },
    { question: 'Does rotating a PDF reduce its quality?', answer: 'No. Rotation only changes the page\'s display orientation metadata — the underlying text and images are copied unchanged, so there\'s no quality loss.' },
    { question: 'Can I rotate different pages in different directions?', answer: 'Currently, rotation applies to an entire file at once. To rotate only specific pages, split them into a separate file first with the Split PDF tool, rotate that file, then merge it back with the rest.' },
    { question: 'What happens if I upload multiple files?', answer: 'Each file can be rotated independently, but downloading combines all uploaded files into one output PDF with their respective rotations applied.' },
    { question: 'How do I undo a rotation?', answer: 'Click the rotate button in the opposite direction the same number of times to return to the original orientation, or remove the file and re-upload it to start fresh.' },
    { question: 'Can I rotate a password-protected PDF?', answer: 'Not directly — use the Unlock PDF tool to remove the password first, then rotate the unlocked file.' }
  ]
};
