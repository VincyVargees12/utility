import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const REMOVE_BLANK_PAGES_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'PDF Blank Page Remover',

  whatIsTitle: 'What is a Blank Page in a PDF?',
  whatIsBody: [
    'A blank page is a page with no meaningful visible content — often the back side of a one-sided scanned document, a separator sheet picked up by an automatic document feeder, or an accidental extra page left over from a scan or export.',
    'Blank pages are harmless but add clutter: they inflate page counts, waste paper if the document is printed, and make a document feel unpolished when shared.'
  ],

  whatIsToolTitle: 'What is this Blank Page Remover tool?',
  whatIsToolBody: [
    'This is a browser-based tool that scans every page of a PDF and automatically flags the ones that look blank, based on how much visible (non-white) content each page contains. Upload a PDF, review the flagged pages in a grid, and adjust or override the selection before removing them.',
    'A sensitivity slider controls how strict the detection is, and any page can be toggled by hand — the automatic scan is a starting point, not the final word. Everything runs locally using pdf-lib, so your file is never uploaded to a server.'
  ],

  whyUseTitle: 'Why Remove Blank Pages from a PDF?',
  whyUseItems: [
    'Clean up scanned documents — remove the blank backs left behind when scanning one-sided paper with a duplex scanner.',
    'Shrink a bloated page count — trim accidental blank pages left over from exporting or merging documents.',
    'Prepare a document for printing — avoid wasting paper on pages with nothing on them.',
    'Tidy up before sharing — present a polished document without stray empty pages breaking up the flow.',
    'Simplify further editing — a shorter, blank-free document is easier to review, split, or reorganize afterward.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Automatically scans every page and flags likely-blank ones',
    'Adjustable sensitivity to control how strict the blank detection is',
    'Review every page in a thumbnail grid before anything is removed',
    'Manually keep or remove any individual page, overriding the automatic scan',
    'Shows a live count of pages that will be kept vs. removed',
    'Runs entirely in your browser — your PDF is never uploaded to a server'
  ],

  howToTitle: 'How to Remove Blank Pages from a PDF',
  howTo: [
    { title: 'Upload your PDF', description: 'Click to select or drag and drop a PDF file onto the upload area.' },
    { title: 'Let it scan', description: 'Every page is analyzed automatically and likely-blank pages are pre-marked for removal.' },
    { title: 'Review and adjust', description: 'Click any page thumbnail to keep or remove it, and fine-tune the sensitivity slider if pages are being over- or under-flagged.' },
    { title: 'Download the result', description: 'Click "Remove Blank Pages" to build the cleaned-up document, then download it.' }
  ],

  commonErrorsTitle: 'Common Blank Page Remover Errors and Pitfalls',
  commonErrors: [
    { title: 'A page with faint content is flagged as blank', description: 'Very light scans, watermarks, or faint page numbers can look blank to the detector — lower the sensitivity percentage so fewer pixels are needed to count a page as having content, or manually uncheck that page.' },
    { title: 'A page with a stray mark isn\'t flagged', description: 'A page that\'s mostly empty but has a small stamp, page number, or scan artifact may not be detected as blank — raise the sensitivity percentage, or remove it manually.' },
    { title: 'Removing every page', description: 'If every page ends up marked for removal, there\'s nothing left to save — keep at least one page.' },
    { title: 'Encrypted PDF fails to load', description: 'Password-protected PDFs can\'t be scanned directly. Remove the password first using the Unlock PDF tool, then run the blank page scan.' },
    { title: 'Slow scan on very long documents', description: 'Every page is rendered and analyzed after upload, which can take a little longer for documents with hundreds of pages — the page grid updates as each page finishes scanning.' }
  ],

  examplesTitle: 'Blank Page Remover Example',
  examples: [
    {
      title: 'Cleaning up a duplex scan',
      description: 'A one-sided document scanned with a duplex scanner, leaving blank backs.',
      input: 'scanned-notes.pdf, 20 pages, 9 detected as blank',
      output: 'scanned-notes-no-blanks.pdf, 11 pages'
    },
    {
      title: 'Trimming an accidental extra page',
      description: 'A stray blank page left at the end of an exported document.',
      input: 'invoice.pdf, 3 pages, page 3 detected as blank',
      output: 'invoice-no-blanks.pdf, 2 pages'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Scanning and removing pages happens entirely in your browser using pdf-lib and pdf.js. Your PDF file is never sent to a server.' },
    { question: 'How does the blank page detection work?', answer: 'Each page is rendered to an image and analyzed for how much of it is non-white. Pages with less visible content than your chosen sensitivity threshold are flagged as blank.' },
    { question: 'Is the detection perfect?', answer: 'No automatic detection is perfect — very faint content or tiny marks can be missed or over-flagged. Always review the highlighted pages before downloading, and adjust sensitivity or toggle pages by hand as needed.' },
    { question: 'Can I remove a page manually that wasn\'t flagged as blank?', answer: 'Yes — click any page thumbnail to toggle whether it\'s kept or removed, regardless of what the automatic scan detected.' },
    { question: 'Can I scan a password-protected PDF?', answer: 'Not directly — use the Unlock PDF tool to remove the password first, then run the blank page scan on the unlocked file.' },
    { question: 'Does this reduce the quality of the pages I keep?', answer: 'No. Kept pages are copied unchanged into the new document — only the blank pages are left out.' }
  ]
};
