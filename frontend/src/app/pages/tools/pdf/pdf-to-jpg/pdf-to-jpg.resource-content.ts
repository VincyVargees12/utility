import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const PDF_TO_JPG_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'PDF to JPG',

  whatIsTitle: 'What is PDF to JPG Conversion?',
  whatIsBody: [
    'PDF to JPG conversion renders each page of a PDF document as a separate JPEG image, turning a document format into a raster image format. Every page becomes its own standalone picture, at whatever resolution and quality you choose.',
    'This is different from extracting embedded images from a PDF — it captures the entire visual appearance of each page (text, graphics, and images together) exactly as it would look printed or viewed, then saves that as a JPG.'
  ],

  whatIsToolTitle: 'What is this PDF to JPG tool?',
  whatIsToolBody: [
    'This is a browser-based converter that turns every page of a PDF into a high-quality JPG image. Upload a PDF, choose Normal or High quality, and the tool renders each page to a canvas and exports it as a JPEG.',
    'For a single-page PDF, you get one JPG file directly. For multi-page PDFs, all the resulting images are automatically bundled into a ZIP archive so you can download every page at once. Rendering happens entirely in your browser using pdf.js — the file is never uploaded to a server.'
  ],

  whyUseTitle: 'Why Convert PDF to JPG?',
  whyUseItems: [
    'Use pages as images — drop a PDF page into a slide deck, document, or design tool that only accepts image formats.',
    'Share on platforms that don\'t support PDFs — post a page to social media or a messaging app that only previews or accepts images.',
    'Create thumbnails or previews — generate a quick visual preview of a document\'s contents without needing a PDF viewer.',
    'Extract a single page as a picture — pull out one page (like a certificate or diagram) as a standalone image file.',
    'Archive scanned documents as images — some workflows or systems store visual records as JPGs rather than PDFs.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Converts every page of a PDF into a separate JPG image',
    'Two quality presets: Normal (smaller files, good for screens) and High (larger files, better for print/editing)',
    'Live thumbnail preview of the PDF before converting',
    'Automatically zips multi-page results into a single downloadable archive',
    'Single-page PDFs download directly as one JPG file, no zip needed',
    'Preserves each page\'s original aspect ratio and orientation',
    'Runs entirely in your browser — your PDF is never uploaded to a server'
  ],

  howToTitle: 'How to Convert PDF to JPG',
  howTo: [
    { title: 'Upload your PDF', description: 'Click "Select PDF file" or drag and drop the document you want to convert.' },
    { title: 'Choose image quality', description: 'Pick "Normal Quality" for smaller files suited to screen viewing, or "High Quality" for sharper images suited to printing or editing.' },
    { title: 'Convert to JPG', description: 'Click "Convert to JPG." Each page is rendered to a canvas and exported as a JPEG image.' },
    { title: 'Download your images', description: 'A single-page PDF downloads as one JPG; a multi-page PDF downloads as a ZIP file containing one JPG per page.' }
  ],

  commonErrorsTitle: 'Common PDF to JPG Errors and Pitfalls',
  commonErrors: [
    { title: 'White background replacing transparency', description: 'JPG doesn\'t support transparency, so any transparent areas on a PDF page are filled with white in the output image — this is expected, not a bug.' },
    { title: 'Blurry text at Normal quality', description: 'Normal quality renders at a lower scale for smaller file sizes, which can make small text look soft when zoomed in. Switch to High Quality if you need to read fine print in the image.' },
    { title: 'Large files at High quality', description: 'High Quality renders at a much larger scale (roughly double the resolution), which produces noticeably bigger image files — expect longer conversion times and larger downloads for long documents.' },
    { title: 'Expecting embedded images instead of full pages', description: 'This tool captures the entire rendered page, not just the pictures embedded within it — if you only want an embedded photo, you\'ll need to crop the resulting JPG afterward.' },
    { title: 'Encrypted PDF fails to load', description: 'Password-protected PDFs may not render correctly. Remove the password first using the Unlock PDF tool, then convert.' }
  ],

  examplesTitle: 'PDF to JPG Example',
  examples: [
    {
      title: 'Converting a multi-page document',
      description: 'A typical conversion producing one image per page, bundled into a zip.',
      input: 'presentation.pdf (5 pages), High Quality selected',
      output: 'presentation_images.zip containing presentation_page_1.jpg … presentation_page_5.jpg'
    },
    {
      title: 'Converting a single-page PDF',
      description: 'When there\'s only one page, the tool skips zipping and gives you the image directly.',
      input: 'certificate.pdf (1 page), Normal Quality selected',
      output: 'certificate.jpg'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Conversion happens entirely in your browser using pdf.js. Your PDF is never sent to a server.' },
    { question: 'What\'s the difference between Normal and High quality?', answer: 'Normal Quality renders each page at a smaller scale for smaller, screen-friendly file sizes. High Quality renders at roughly double the resolution, producing sharper images better suited for printing or detailed editing, at the cost of larger file sizes.' },
    { question: 'Why did I get a ZIP file instead of individual JPGs?', answer: 'When a PDF has more than one page, all resulting images are bundled into a single ZIP archive so you can download everything in one step instead of one file at a time.' },
    { question: 'Will the converted images have a transparent background?', answer: 'No. JPG doesn\'t support transparency, so any transparent regions in the PDF page are filled with white in the output image.' },
    { question: 'Can I convert just one page of a multi-page PDF?', answer: 'This tool converts every page. If you only need one page as an image, first use the Split PDF tool to extract that page into its own PDF, then convert it here.' },
    { question: 'Can I convert a password-protected PDF?', answer: 'Not directly — use the Unlock PDF tool to remove the password first, then convert the unlocked file.' }
  ]
};
