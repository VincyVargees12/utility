import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const JPG_TO_PDF_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'JPG to PDF',

  whatIsTitle: 'What is JPG to PDF Conversion?',
  whatIsBody: [
    'JPG to PDF conversion takes one or more image files and places each one onto its own page of a new PDF document. The images themselves aren\'t altered — they\'re simply embedded into a PDF container, one image per page, in the order you specify.',
    'This is a common way to turn a set of photos or scanned pages into a single, portable document that opens consistently across devices and can be printed, signed, or archived like any other PDF.'
  ],

  whatIsToolTitle: 'What is this JPG to PDF tool?',
  whatIsToolBody: [
    'This is a browser-based tool for combining JPG and PNG images into a single PDF file. Upload multiple images, arrange them in the order you want (via drag-and-drop, add more, and remove buttons), choose a page size and margin, and convert them into one PDF.',
    'You can choose "Fit (same size)" to make each PDF page match its image\'s dimensions exactly, or "A4" to place each image centered and scaled to fit a standard A4 page. Margin options (None, Small, Big) add breathing room around each image. Everything is processed locally using pdf-lib — your images never leave your browser.'
  ],

  whyUseTitle: 'Why Convert JPG to PDF?',
  whyUseItems: [
    'Combine scanned pages — turn a series of photos of a document (taken with a phone camera) into one shareable, printable PDF.',
    'Submit photo-based paperwork — many forms and applications require a single PDF rather than several separate image attachments.',
    'Create a photo booklet or portfolio — assemble multiple images into one document for printing or sharing as a set.',
    'Preserve consistent formatting — a PDF displays identically across devices and printers, unlike images which can be resized or cropped differently by different viewers.',
    'Archive receipts or ID photos — consolidate multiple images into a single, well-organized PDF for record-keeping.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Combine multiple JPG and PNG images into a single PDF, one image per page',
    'Drag-and-drop or add-more upload for building an image queue',
    'Remove any image from the queue before converting',
    'Choose "Fit (same size)" to match page size to each image, or "A4" for a standard page size',
    'Three margin presets: None, Small, and Big',
    'Automatically centers and scales images to fit the page while preserving aspect ratio (A4 mode)',
    'Supports both JPG and PNG image formats',
    'Runs entirely in your browser — your images are never uploaded to a server'
  ],

  howToTitle: 'How to Convert JPG to PDF',
  howTo: [
    { title: 'Upload your images', description: 'Click "Select Image files" or drag and drop one or more JPG/PNG images onto the upload area.' },
    { title: 'Arrange your images', description: 'Reorder the images if needed, and click "Add more" to include additional images before converting.' },
    { title: 'Choose page size', description: 'Select "Fit (same size)" to make each page match its image\'s dimensions, or "A4 (210x297mm)" for a standard page size with the image centered.' },
    { title: 'Set a margin', description: 'Choose None, Small, or Big to control the whitespace around each image on the page.' },
    { title: 'Convert to PDF', description: 'Click "Convert to PDF" to build the document, then download the result — a single PDF with one image per page.' }
  ],

  commonErrorsTitle: 'Common JPG to PDF Errors and Pitfalls',
  commonErrors: [
    { title: 'Unsupported image format', description: 'Only JPG and PNG images can be embedded; other formats (like HEIC, WEBP, or GIF) are skipped during conversion with a warning logged to the console. Convert them to JPG or PNG first if needed.' },
    { title: 'Images appear stretched or distorted', description: 'This shouldn\'t normally happen since the tool preserves aspect ratio, but if a source image itself has an unusual aspect ratio, the resulting page will reflect that same shape — check the source image if the layout looks off.' },
    { title: 'Very large output file', description: 'High-resolution photos embedded directly can produce a large PDF, since images aren\'t re-compressed during conversion. Use the Compress PDF tool afterward if the file size matters.' },
    { title: 'Wrong image order', description: 'Images are placed on pages in the order they appear in the queue — reorder them before converting, since the order can\'t be changed afterward without starting over.' },
    { title: 'Margins clipping large images in A4 mode', description: 'A large margin ("Big") combined with a very tall or wide image can shrink it significantly to fit within the remaining page area — try "None" or "Small" margin, or "Fit (same size)" mode if the image looks too small.' }
  ],

  examplesTitle: 'JPG to PDF Example',
  examples: [
    {
      title: 'Combining scanned receipt photos',
      description: 'A typical use case turning several phone photos into one PDF for expense reporting.',
      input: 'receipt-1.jpg, receipt-2.jpg, receipt-3.jpg — A4 page size, Small margin',
      output: 'images-converted.pdf (3 pages, one receipt centered on each A4 page)'
    },
    {
      title: 'Converting a single image at its native size',
      description: 'Using Fit mode to create a PDF page that exactly matches the image dimensions.',
      input: 'certificate-scan.jpg — Fit (same size), no margin',
      output: 'certificate-scan.pdf (1 page, sized to match the image exactly)'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Conversion happens entirely in your browser using pdf-lib. Your images are never sent to a server.' },
    { question: 'What image formats are supported?', answer: 'JPG/JPEG and PNG images are supported. Other formats will be skipped during conversion.' },
    { question: 'What\'s the difference between "Fit (same size)" and "A4"?', answer: '"Fit (same size)" makes each PDF page exactly match its image\'s dimensions plus any margin. "A4" places every image on a standard 210x297mm page, scaled down and centered to fit while preserving its aspect ratio.' },
    { question: 'Can I reorder images after uploading them?', answer: 'Yes, arrange them before converting — reordering options are the same as on the Merge PDF tool. Once converted, the page order in the PDF can\'t be changed without starting over.' },
    { question: 'Will my images lose quality?', answer: 'No, images are embedded as-is without re-compression. If the final PDF is too large, use the Compress PDF tool afterward to reduce its size.' },
    { question: 'Can I mix JPG and PNG images in one PDF?', answer: 'Yes, you can upload and combine both JPG and PNG files together in the same document.' }
  ]
};
