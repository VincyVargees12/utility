import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const COMPRESS_PDF_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Compress PDF',

  whatIsTitle: 'What is PDF Compression?',
  whatIsBody: [
    'PDF compression reduces the file size of a PDF document, most often by re-encoding the images it contains at a lower resolution or quality level. Large PDFs are usually large because of high-resolution scans or images embedded in them, not the text itself, so compression targets that image data to shrink the overall file.',
    'The trade-off is a balance between file size and visual quality: more aggressive compression produces a smaller file but with more visible loss of image detail, while lighter compression keeps quality closer to the original at the cost of a larger file.'
  ],

  whatIsToolTitle: 'What is this Compress PDF tool?',
  whatIsToolBody: [
    'This is a browser-based PDF compressor. Upload a PDF, choose a compression level, and the tool re-renders every page as an optimized JPEG image at a resolution and quality tuned to that level, then reassembles those images into a new, smaller PDF.',
    'Three compression levels are available — Extreme (smallest file, more visible quality loss), Recommended (a balanced middle ground for everyday sharing), and Less compression (largest file, closest to original quality) — so you can choose the right trade-off for your use case. All processing happens locally using pdf.js and pdf-lib, and you\'ll see exactly how many bytes were saved once compression finishes.'
  ],

  whyUseTitle: 'Why Compress a PDF?',
  whyUseItems: [
    'Meet email attachment limits — shrink a scanned document so it fits under a mail provider\'s size cap instead of splitting it into multiple emails.',
    'Speed up uploads and downloads — smaller files transfer faster over slow or metered connections, especially useful for mobile users.',
    'Save storage space — reduce the footprint of scanned archives or large image-heavy reports across a shared drive or cloud storage.',
    'Improve website performance — compress PDFs that are hosted for download on a website so pages load faster and use less bandwidth.',
    'Simplify sharing via messaging apps — many chat platforms cap file sizes, so compressing a PDF first avoids upload failures.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Three compression levels: Extreme, Recommended, and Less compression',
    'Live preview thumbnail of the uploaded PDF before compressing',
    'Shows original file size and page count before processing',
    'Reports exactly how many bytes were saved after compression',
    'Works on multi-page documents, compressing every page consistently',
    'Download the compressed PDF immediately once processing finishes',
    'Runs entirely in your browser — your document is never uploaded to a server'
  ],

  howToTitle: 'How to Compress a PDF File',
  howTo: [
    { title: 'Upload your PDF', description: 'Click "Select PDF file" or drag and drop the document you want to shrink.' },
    { title: 'Pick a compression level', description: 'Choose "Extreme compression" for the smallest possible file, "Recommended compression" for a balanced result, or "Less compression" to preserve more image quality.' },
    { title: 'Compress the file', description: 'Click "Compress PDF." The tool renders each page as an optimized image and rebuilds the document at the chosen quality level.' },
    { title: 'Review the savings', description: 'Once processing completes, check how much smaller the file is compared to the original.' },
    { title: 'Download the result', description: 'Download the compressed PDF, ready to share or upload wherever file size matters.' }
  ],

  commonErrorsTitle: 'Common Compress PDF Errors and Pitfalls',
  commonErrors: [
    { title: 'Text becomes an image', description: 'Because compression re-renders each page as a JPEG, text in the output PDF is no longer selectable or searchable — this is expected behavior, not a bug, and is the trade-off for smaller file size.' },
    { title: 'Over-compressing text-heavy documents', description: 'Extreme compression is tuned for image-heavy scans; on text-heavy documents it can make small fonts look blurry. Try "Recommended" or "Less compression" if legibility suffers.' },
    { title: 'Little to no size reduction', description: 'If a PDF is already mostly text with few or no images, compression may save very little, since there\'s no large image data to re-encode.' },
    { title: 'Encrypted PDF fails to process', description: 'Password-protected PDFs may not load correctly for compression. Remove the password first using the Unlock PDF tool.' },
    { title: 'Large files taking a while to process', description: 'Very large or high page-count PDFs are rendered page by page in the browser, which can take noticeably longer than typical documents — let it finish rather than reloading the page.' }
  ],

  examplesTitle: 'Compress PDF Example',
  examples: [
    {
      title: 'Compressing a scanned document for email',
      description: 'A typical use case reducing a large scan down to a size that fits under a common email attachment limit.',
      input: 'scanned-contract.pdf — 10.69 MB, 23 pages, Recommended compression',
      output: 'scanned-contract-compressed.pdf — roughly 2-4 MB depending on image content, same 23 pages'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Compression happens entirely in your browser using pdf.js and pdf-lib. Your document is never sent to a server.' },
    { question: 'Which compression level should I choose?', answer: '"Recommended compression" is a good default for most documents. Use "Extreme compression" when file size matters most and some quality loss is acceptable, or "Less compression" when you want to preserve image quality as closely as possible while still saving some space.' },
    { question: 'Will compressing my PDF make the text unselectable?', answer: 'Yes. This tool compresses pages by converting them to optimized images, so text in the resulting PDF is part of the image and can no longer be selected, searched, or copied.' },
    { question: 'Why didn\'t my file get much smaller?', answer: 'PDFs that are mostly text with few images have little image data to compress, so the size reduction will be modest. Compression has the biggest impact on documents with large photos or high-resolution scans.' },
    { question: 'Can I compress a password-protected PDF?', answer: 'Not directly — remove the password first with the Unlock PDF tool, then compress the unlocked file.' },
    { question: 'Does compression reduce the number of pages?', answer: 'No. Every page from the original document is preserved in the compressed output — only the file size changes, not the page count or content.' }
  ]
};
