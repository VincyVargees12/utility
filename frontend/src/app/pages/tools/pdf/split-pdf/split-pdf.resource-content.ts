import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const SPLIT_PDF_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Split PDF',

  whatIsTitle: 'What is PDF Splitting?',
  whatIsBody: [
    'PDF splitting is the process of breaking one PDF document into two or more smaller PDF files, based on page ranges, a fixed number of pages per file, or a specific set of pages you select individually. It\'s the inverse of merging: instead of combining files, you\'re dividing one file into pieces.',
    'Splitting is useful whenever a single document actually contains multiple logical documents — a scanned batch of invoices, a book with distinct chapters, or a bundle of forms — and you need to separate them so each piece can be filed, shared, or processed independently.'
  ],

  whatIsToolTitle: 'What is this Split PDF tool?',
  whatIsToolBody: [
    'This is a browser-based tool for dividing a PDF into multiple files. Upload a PDF and choose one of three modes: Range (split by custom from/to page ranges, or a fixed number of pages per file), Pages (select individual pages to extract), or Size — giving you fine control over exactly how the document is divided.',
    'You can preview every page as a thumbnail before splitting, define multiple custom ranges at once, and choose whether each range becomes its own file or all selected content is merged into a single output. Everything runs locally using pdf-lib and pdf.js, so your document is never uploaded to a server.'
  ],

  whyUseTitle: 'Why Split PDF Files?',
  whyUseItems: [
    'Separate a batch scan — divide a single scanned file containing many invoices or receipts into individual documents, one per item.',
    'Extract a chapter or section — pull out just the pages you need from a long report, book, or manual without sending the whole file.',
    'Share only what\'s relevant — send a colleague pages 10-15 of a contract instead of the entire 100-page document.',
    'Reduce file size for sharing — split a large PDF into smaller pieces that are easier to email or upload where size limits apply.',
    'Reorganize a document — extract specific pages in a custom order to assemble a new, smaller document from an existing one.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Split by custom page ranges (e.g. pages 1-5, 6-10) with support for multiple ranges at once',
    'Split by a fixed number of pages per output file',
    'Extract individual pages by selecting them directly from a thumbnail grid',
    'Type page numbers or ranges (e.g. "1-3, 7, 10-12") to select pages quickly',
    'Option to merge all selected ranges/pages into one file, or keep them as separate files',
    'Live page thumbnails generated for the entire document',
    'Shows the resulting output file count before you split',
    'Download all resulting files at once',
    'Runs entirely in your browser — your PDF is never uploaded to a server'
  ],

  howToTitle: 'How to Split a PDF File',
  howTo: [
    { title: 'Upload your PDF', description: 'Click "Select PDF file" or drag and drop the document you want to split.' },
    { title: 'Choose a split mode', description: 'Pick "Range" to define custom or fixed page ranges, or "Pages" to hand-pick individual pages from the thumbnail preview.' },
    { title: 'Define your ranges or selection', description: 'Enter from/to page numbers for each range (click "Add Range" for more), set a fixed page count, or click on individual page thumbnails to select them.' },
    { title: 'Decide on merging', description: 'Optionally check "Merge all ranges in one PDF file" if you want the selected content combined into a single output instead of separate files.' },
    { title: 'Split and download', description: 'Click "Split PDF" to process the document, then download the resulting file(s), each named after the original with a part number appended.' }
  ],

  commonErrorsTitle: 'Common Split PDF Errors and Pitfalls',
  commonErrors: [
    { title: 'Invalid page range', description: 'A "from" page greater than the "to" page, or a page number outside the document\'s page count, is automatically corrected or reverted — but double-check your ranges before splitting to get the output you expect.' },
    { title: 'Forgetting to select any pages', description: 'In "Pages" mode, the split button stays disabled until at least one page is selected — if nothing appears to happen, check that pages are actually checked in the thumbnail grid.' },
    { title: 'Unexpected number of output files', description: 'Fixed-interval splitting rounds up (e.g. 23 pages at 5 per file produces 5 files, the last with only 3 pages) — review the file count shown before splitting if you need an exact number of outputs.' },
    { title: 'Encrypted PDF fails to load', description: 'Password-protected PDFs may not load correctly for splitting. Remove the password first with the Unlock PDF tool.' },
    { title: 'Losing track of range order', description: 'When multiple ranges are defined, each becomes a separate output file in the order the ranges are listed — reorder or remove ranges before splitting if the sequence matters.' }
  ],

  examplesTitle: 'Split PDF Example',
  examples: [
    {
      title: 'Splitting a report into fixed 5-page chunks',
      description: 'Using Range mode with "Fixed" range mode to break a document into equal-sized pieces.',
      input: 'annual-report.pdf (23 pages), fixed at 5 pages per file',
      output: 'annual-report_part_1.pdf … annual-report_part_5.pdf (five files, last one with 3 pages)'
    },
    {
      title: 'Extracting specific pages',
      description: 'Using Pages mode to pull out a non-contiguous set of pages into one merged file.',
      input: 'contract.pdf, pages "1, 5, 8-10" selected with "Merge" enabled',
      output: 'One PDF containing pages 1, 5, 8, 9, and 10 from the original, in that order'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Splitting happens entirely in your browser using pdf-lib and pdf.js. Your PDF is never sent to a server.' },
    { question: 'What\'s the difference between Range and Pages mode?', answer: 'Range mode splits by defining from/to page numbers (either custom ranges or a fixed interval), producing one file per range. Pages mode lets you click individual page thumbnails to build a custom selection, which can be output as separate files or merged into one.' },
    { question: 'Can I get all my selected pages in one file instead of several?', answer: 'Yes — enable "Merge all ranges in one PDF file" (Range mode) or the equivalent merge option in Pages mode to combine everything into a single output.' },
    { question: 'Will splitting reduce my file size?', answer: 'Splitting divides the existing pages without re-compressing them, so each resulting file\'s size is roughly proportional to its share of pages. Use the Compress PDF tool if you also need to reduce file size.' },
    { question: 'Can I split an encrypted PDF?', answer: 'Password-protected PDFs may fail to load correctly. Use the Unlock PDF tool to remove the password first, then split.' },
    { question: 'How are the output files named?', answer: 'Each output file is named after the original document with "_part_1", "_part_2", etc. appended, in the order the ranges or pages were defined.' }
  ]
};
