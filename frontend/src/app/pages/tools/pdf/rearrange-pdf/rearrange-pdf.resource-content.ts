import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const REARRANGE_PDF_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Rearrange PDF Pages',

  whatIsTitle: 'What is Rearranging PDF Pages?',
  whatIsBody: [
    'Rearranging a PDF means changing the order its pages appear in, without altering the content of any page — useful when pages were scanned out of order, sections need to be reorganized, or a cover page needs to move to the front.',
    'It\'s often paired with two related edits: rotating individual pages that are sideways or upside-down, and deleting pages that don\'t belong, so a document can be fully tidied up in one pass.'
  ],

  whatIsToolTitle: 'What is this Rearrange PDF Pages tool?',
  whatIsToolBody: [
    'This is a browser-based tool for reordering, rotating, and deleting PDF pages. Upload a PDF and every page appears as a thumbnail in a grid — drag a page to a new position, use the up/down arrows, rotate a page 90 degrees, or delete it entirely.',
    'When you save, a new PDF is built using your chosen order, rotations, and page selection. Everything runs locally using pdf-lib, so your file is never uploaded to a server.'
  ],

  whyUseTitle: 'Why Rearrange PDF Pages?',
  whyUseItems: [
    'Fix a scan that came out of order — put pages back in the correct sequence after scanning a stack of paper.',
    'Move a cover page or table of contents to the front — reorganize a document\'s structure without recreating it.',
    'Remove blank or unwanted pages — delete a stray scanned page or an outdated section.',
    'Correct sideways or upside-down pages — rotate individual pages while reordering, in the same pass.',
    'Reverse an entire document — flip a document that was scanned back-to-front into the correct reading order.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Drag-and-drop page thumbnails to reorder them, or use per-page arrow buttons',
    'Rotate individual pages 90 degrees at a time',
    'Delete pages you don\'t want in the final document',
    'One-click "Reverse page order" for flipping an entire document',
    'Live thumbnail preview of every page, including applied rotation',
    'Runs entirely in your browser — your PDF is never uploaded to a server'
  ],

  howToTitle: 'How to Rearrange PDF Pages',
  howTo: [
    { title: 'Upload your PDF', description: 'Click to select or drag and drop a PDF file onto the upload area.' },
    { title: 'Reorder the pages', description: 'Drag any page thumbnail to a new position, or use the up/down arrows on hover.' },
    { title: 'Rotate or delete pages', description: 'Hover a page to rotate it 90 degrees or delete it entirely, as needed.' },
    { title: 'Save the result', description: 'Click "Save PDF" to build the new document, then download it.' }
  ],

  commonErrorsTitle: 'Common Rearrange PDF Errors and Pitfalls',
  commonErrors: [
    { title: 'Deleting every page', description: 'If all pages are deleted, there\'s nothing left to save — leave at least one page in the grid.' },
    { title: 'Single-page PDF uploaded', description: 'A one-page PDF has nothing to reorder. This tool is for multi-page documents.' },
    { title: 'Encrypted PDF fails to load', description: 'Password-protected PDFs can\'t be processed directly. Remove the password first using the Unlock PDF tool, then rearrange it.' },
    { title: 'Rotation applied to the wrong page', description: 'The rotate button only affects the page you hover over — double-check the order badge in the corner of the card before rotating if pages have already been reordered.' },
    { title: 'Thumbnails slow to appear on large PDFs', description: 'Every page is rendered as a thumbnail after upload, which can take a few seconds for very long documents — the page order and count are usable immediately, thumbnails fill in as they finish rendering.' }
  ],

  examplesTitle: 'Rearrange PDF Pages Example',
  examples: [
    {
      title: 'Moving a cover page to the front',
      description: 'A scanned document where the cover ended up as the last page.',
      input: 'report.pdf, page 12 (cover) dragged to position 1',
      output: 'report-rearranged.pdf, cover page now first'
    },
    {
      title: 'Removing a blank scanned page',
      description: 'A stray blank page picked up during scanning.',
      input: 'contract.pdf, page 4 deleted',
      output: 'contract-rearranged.pdf, 7 pages instead of 8'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Reordering, rotating, and deleting pages all happen entirely in your browser using pdf-lib. Your PDF file is never sent to a server.' },
    { question: 'Can I undo a deleted page?', answer: 'Not directly — if you delete a page by mistake, click "Start Over" and re-upload the file to begin again before saving.' },
    { question: 'Does rearranging pages reduce PDF quality?', answer: 'No. Pages are copied unchanged into the new document — only their order, rotation, and presence are affected.' },
    { question: 'Can I rearrange a password-protected PDF?', answer: 'Not directly — use the Unlock PDF tool to remove the password first, then rearrange the unlocked file.' },
    { question: 'What does the rotate button do?', answer: 'Each click rotates that page a further 90 degrees clockwise. Click it up to three more times to reach 180 or 270 degrees.' },
    { question: 'Can I upload more than one PDF at a time?', answer: 'This tool works on the pages within a single PDF. To combine pages from multiple files first, use the Merge PDF tool, then rearrange the result here.' }
  ]
};
