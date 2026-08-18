import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const DUPLICATE_PAGE_FINDER_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'PDF Duplicate Page Finder',

  whatIsTitle: 'What is a Duplicate Page in a PDF?',
  whatIsBody: [
    'A duplicate page is a page that repeats elsewhere in the same document — the same content appearing twice because a document was scanned twice, a page was accidentally inserted more than once, or two files with overlapping pages were merged together.',
    'Duplicate pages inflate the page count, make a document harder to navigate, and can be confusing or unprofessional when the document is shared or printed.'
  ],

  whatIsToolTitle: 'What is this Duplicate Page Finder tool?',
  whatIsToolBody: [
    'This is a browser-based tool that compares every page of a PDF against every other page and flags the ones that match. Upload a PDF, review the matching groups in a grid, and the first page in each group is kept by default while the rest are marked for removal.',
    'A match threshold slider controls how strict the comparison is, and any page can be toggled by hand — the automatic scan is a starting point, not the final word. Everything runs locally using pdf-lib and pdf.js, so your file is never uploaded to a server.'
  ],

  whyUseTitle: 'Why Find and Remove Duplicate Pages?',
  whyUseItems: [
    'Clean up an accidental double-scan — remove the second copy when a document was scanned or exported twice.',
    'Fix a botched merge — trim overlapping pages left over after combining two versions of the same document.',
    'Shrink a bloated page count — keep a document lean by removing repeated content.',
    'Tidy up before sharing — present a document without confusing, repeated pages breaking up the flow.',
    'Verify a document is clean — quickly confirm a long PDF doesn\'t contain accidental repeats before archiving it.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Automatically compares every page against every other page in the document',
    'Groups matching pages together and keeps the first occurrence by default',
    'Adjustable match threshold to control how strict the comparison is',
    'Review every page in a thumbnail grid before anything is removed',
    'Manually keep or remove any individual page, overriding the automatic scan',
    'Runs entirely in your browser — your PDF is never uploaded to a server'
  ],

  howToTitle: 'How to Find and Remove Duplicate Pages in a PDF',
  howTo: [
    { title: 'Upload your PDF', description: 'Click to select or drag and drop a PDF file onto the upload area.' },
    { title: 'Let it scan', description: 'Every page is compared against every other page, and matching groups are marked automatically.' },
    { title: 'Review and adjust', description: 'Click any page thumbnail to keep or remove it, and fine-tune the match threshold if pages are being over- or under-matched.' },
    { title: 'Download the result', description: 'Click "Remove Duplicate Pages" to build the cleaned-up document, then download it.' }
  ],

  commonErrorsTitle: 'Common Duplicate Page Finder Errors and Pitfalls',
  commonErrors: [
    { title: 'Similar but different pages get grouped together', description: 'Two pages with a similar layout (e.g. a form template used more than once with different data) can be flagged as duplicates — raise the match threshold percentage so only closer matches are grouped, or manually uncheck the page you want to keep.' },
    { title: 'A true duplicate isn\'t detected', description: 'A page re-scanned at a different angle, brightness, or resolution may not match closely enough — lower the match threshold, or remove the page manually.' },
    { title: 'Wrong page kept in a group', description: 'The first page in a group is kept by default, which may not always be the one you want — click the thumbnail marked "ORIGINAL" to remove it, and click the "DUPLICATE" you\'d rather keep instead.' },
    { title: 'Removing every page', description: 'If every page ends up marked for removal, there\'s nothing left to save — keep at least one page.' },
    { title: 'Encrypted PDF fails to load', description: 'Password-protected PDFs can\'t be scanned directly. Remove the password first using the Unlock PDF tool, then run the duplicate scan.' }
  ],

  examplesTitle: 'Duplicate Page Finder Example',
  examples: [
    {
      title: 'Removing an accidental double-scan',
      description: 'A document where the same page was scanned twice by mistake.',
      input: 'contract.pdf, 10 pages, page 7 matches page 3',
      output: 'contract-no-duplicates.pdf, 9 pages'
    },
    {
      title: 'Cleaning up a merged document',
      description: 'Two files merged together that shared an overlapping cover page.',
      input: 'combined.pdf, 15 pages, page 8 matches page 1',
      output: 'combined-no-duplicates.pdf, 14 pages'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Scanning and removing pages happens entirely in your browser using pdf-lib and pdf.js. Your PDF file is never sent to a server.' },
    { question: 'How does duplicate detection work?', answer: 'Each page is rendered to a small grayscale image and reduced to a compact fingerprint. Pages whose fingerprints match closely enough, based on your chosen threshold, are grouped as duplicates.' },
    { question: 'Is the detection perfect?', answer: 'No automatic comparison is perfect — pages with similar layouts but different content, or true duplicates rendered with slight differences, can be over- or under-matched. Always review the highlighted groups before downloading.' },
    { question: 'Which page gets kept in a group?', answer: 'The first occurrence in the document is kept by default. You can override this by clicking any page thumbnail to change which ones are kept or removed.' },
    { question: 'Can I scan a password-protected PDF?', answer: 'Not directly — use the Unlock PDF tool to remove the password first, then run the duplicate scan on the unlocked file.' },
    { question: 'Does this reduce the quality of the pages I keep?', answer: 'No. Kept pages are copied unchanged into the new document — only the duplicate pages are left out.' }
  ]
};
