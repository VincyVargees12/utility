import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const MERGE_PDF_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Merge PDF',

  whatIsTitle: 'What is PDF Merging?',
  whatIsBody: [
    'PDF merging is the process of combining two or more separate PDF documents into a single file, preserving the pages, formatting, and content of each source document in the order you choose. Instead of sending a client five separate attachments or juggling multiple scans, you end up with one cohesive document.',
    'Because merging works at the page level, it doesn\'t touch the underlying content of each page — text stays selectable, images stay sharp, and any existing formatting is carried over untouched. It\'s simply a reorganization of pages from multiple files into one continuous document.'
  ],

  whatIsToolTitle: 'What is this Merge PDF tool?',
  whatIsToolBody: [
    'This is a browser-based tool for combining multiple PDF files into a single document. Add two or more PDFs, drag the cards to reorder them (or use the up/down arrows on each card), and click "Merge PDF" to produce one combined file with all pages in the order shown.',
    'Every file is processed locally in your browser using pdf-lib — nothing is uploaded to a server, which means your documents never leave your device. Thumbnails are generated for each file so you can visually confirm the page content before merging, and you can add more files at any point before merging.'
  ],

  whyUseTitle: 'Why Merge PDF Files?',
  whyUseItems: [
    'Consolidate paperwork — combine scanned receipts, invoices, or forms that were saved as separate files into one document for filing or emailing.',
    'Build a single report — merge a cover page, chapters, and appendices that were authored or exported separately into one final deliverable.',
    'Simplify sharing — send one attachment instead of several, so recipients don\'t have to download and open multiple files to see the full picture.',
    'Combine signed documents — merge a contract with its signature page or supporting exhibits into a single, complete record.',
    'Reorder and assemble — pull together pages from different sources in a specific sequence, such as assembling a packet from multiple contributors.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Merge two or more PDF files into a single document',
    'Drag-and-drop reordering of files before merging',
    'Up/down arrow buttons on each card for precise reordering without dragging',
    'Live thumbnail preview and page count for every uploaded file',
    'Add more files at any time before merging',
    'Remove a file from the queue with one click',
    'Shows total file count and combined page count before you merge',
    'Download the merged PDF immediately after processing',
    'Runs entirely in your browser — files are never uploaded to a server'
  ],

  howToTitle: 'How to Merge PDF Files',
  howTo: [
    { title: 'Upload your PDFs', description: 'Click "Select PDF files" or drag and drop two or more PDF files onto the upload area.' },
    { title: 'Arrange the order', description: 'Drag the file cards to reorder them, or use the up/down arrow buttons that appear on hover. The numbered badge on each card shows its position in the final document.' },
    { title: 'Add more if needed', description: 'Click "Add more" at any time to include additional PDFs before merging.' },
    { title: 'Merge the files', description: 'Click "Merge PDF" once you have at least two files. The tool combines all pages in the order shown into a single document.' },
    { title: 'Download the result', description: 'Once merging completes, download the combined PDF, which contains every page from your source files in sequence.' }
  ],

  commonErrorsTitle: 'Common Merge PDF Errors and Pitfalls',
  commonErrors: [
    { title: 'File could not be read', description: 'A corrupted PDF, or one saved incorrectly by another tool, may fail to load. The file is automatically removed from the queue with an explanation so it doesn\'t block merging the rest.' },
    { title: 'Password-protected PDFs', description: 'Encrypted PDFs may load with limited access or fail to merge correctly since page content can\'t be fully read. Remove the password first using the Unlock PDF tool, then merge.' },
    { title: 'Wrong page order', description: 'Forgetting to check the numbered badges before merging is the most common mistake — always confirm the order shown in the file cards matches what you want in the final document.' },
    { title: 'Merging only one file', description: 'The merge button stays disabled until at least two PDF files are added, since merging a single file wouldn\'t change anything.' },
    { title: 'Non-PDF files rejected', description: 'Only files with a .pdf extension or application/pdf type are accepted; images or Word documents need to be converted to PDF first (see the JPG to PDF tool).' }
  ],

  examplesTitle: 'Merge PDF Example',
  examples: [
    {
      title: 'Combining a report with an appendix',
      description: 'A typical merge workflow taking two separate documents and producing one file.',
      input: 'quarterly-report.pdf (8 pages) + appendix-data.pdf (15 pages)',
      output: 'quarterly-report-merged.pdf (23 pages, appendix follows the report)'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Merging happens entirely in your browser using the pdf-lib library. Your PDF files are never sent to a server.' },
    { question: 'Is there a limit to how many PDFs I can merge?', answer: 'There\'s no hard-coded limit — you can add as many files as your browser\'s memory can comfortably handle. Very large files or a large number of files may take longer to process.' },
    { question: 'Does merging affect the quality of my PDFs?', answer: 'No. Merging copies the original pages as-is into the new document, so text, images, and formatting remain unchanged.' },
    { question: 'Can I merge password-protected PDFs?', answer: 'Encrypted PDFs may not merge correctly since their content is locked. Use the Unlock PDF tool to remove the password first, then merge.' },
    { question: 'How do I change the order of the merged pages?', answer: 'Drag a file card to a new position, or hover over a card and use the up/down arrow buttons. The numbered badge always shows the current merge order.' },
    { question: 'Can I remove a file after adding it?', answer: 'Yes. Hover over a file card and click the red × button in the corner to remove it from the queue before merging.' }
  ]
};
