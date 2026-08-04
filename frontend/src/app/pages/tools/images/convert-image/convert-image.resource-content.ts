import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const CONVERT_IMAGE_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Convert Image',

  whatIsTitle: 'What is Image Format Conversion?',
  whatIsBody: [
    'Image format conversion changes how a picture\'s data is encoded and stored — from JPG to PNG, HEIC to JPG, PNG to WebP, and many other combinations — while keeping the same visual content. Different formats trade off compression, transparency support, and compatibility differently.',
    'Choosing the right format matters: JPEG suits photos well with small file sizes, PNG suits graphics and anything needing transparency, WebP offers modern compression efficiency, and formats like HEIC are common on phones but poorly supported elsewhere.'
  ],

  whatIsToolTitle: 'What is this Convert Image tool?',
  whatIsToolBody: [
    'This is a browser-based universal image converter supporting 15+ target formats: JPG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO, EPS, PDF, AVIF, JFIF, and HEIC. Upload one or more images (including HEIC/HEIF photos from iPhones), pick a target format, and convert the whole batch at once.',
    'HEIC files are automatically decoded using a dedicated conversion library before being processed, since browsers can\'t natively display them. Every image is redrawn onto a canvas at high quality (95%) and re-encoded in the target format; everything happens locally, so your photos are never uploaded to a server.'
  ],

  whyUseTitle: 'Why Convert Image Formats?',
  whyUseItems: [
    'Open iPhone photos anywhere — convert HEIC files to JPG or PNG so they open in any app, browser, or device without compatibility issues.',
    'Meet a platform\'s format requirement — many upload forms, marketplaces, and design tools only accept specific formats like JPG or PNG.',
    'Switch to a more efficient format — convert to WebP or AVIF for smaller file sizes with comparable visual quality.',
    'Add or remove transparency support — convert to PNG when you need a transparent background, or to JPG when you don\'t and want a smaller file.',
    'Standardize a mixed batch — convert photos from several different source formats into one consistent format for easier handling.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Convert between 15+ formats: JPG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO, EPS, PDF, AVIF, JFIF, HEIC',
    'Automatic HEIC/HEIF decoding for iPhone photos',
    'Bulk conversion — upload and convert multiple images to the same target format at once',
    'High-quality re-encoding (95% quality) for consistent results',
    'Live preview and dimensions shown for every uploaded file',
    'Output filenames automatically updated with the correct extension',
    'Download a single converted image directly, or a ZIP for multiple images',
    'Runs entirely in your browser — your photos are never uploaded to a server'
  ],

  howToTitle: 'How to Convert an Image Format',
  howTo: [
    { title: 'Upload your images', description: 'Click "Select images" or drag and drop one or more image files (including HEIC) onto the upload area.' },
    { title: 'Choose a target format', description: 'Pick the format you want to convert to from the available options in the sidebar.' },
    { title: 'Convert the images', description: 'Click the convert/download button — each image is redrawn on a canvas and re-encoded in the target format.' },
    { title: 'Download the result', description: 'A single converted image downloads directly; multiple images download together as a ZIP file.' }
  ],

  commonErrorsTitle: 'Common Convert Image Errors and Pitfalls',
  commonErrors: [
    { title: 'HEIC conversion fails', description: 'HEIC decoding relies on a browser-side library and can occasionally fail on certain files or browsers — if it fails, the tool shows an error for that file so the rest of the batch can still proceed.' },
    { title: 'Transparency lost when converting to JPG', description: 'JPEG doesn\'t support transparency; converting a PNG or WebP with transparent areas to JPG fills those areas with a white background.' },
    { title: 'Vector or document-style formats not rendered as expected', description: 'Formats like SVG, EPS, and PDF are fundamentally different from raster images — since conversion here works by rendering onto a canvas, results targeting those formats are essentially rasterized snapshots, not true vector/document output.' },
    { title: 'Unrecognized or unsupported source file', description: 'Files that aren\'t images (and don\'t have a .heic/.heif extension) are rejected — double-check the file type if a file won\'t load.' },
    { title: 'Large batches taking a while to process', description: 'Converting many large images (especially from HEIC, which requires decoding first) can take noticeably longer — let it finish rather than reloading the page.' }
  ],

  examplesTitle: 'Convert Image Example',
  examples: [
    {
      title: 'Converting an iPhone photo to JPG',
      description: 'A common case making an HEIC photo viewable everywhere.',
      input: 'IMG_4521.heic — target format JPG',
      output: 'IMG_4521.jpg — same photo, now viewable in any browser or app'
    },
    {
      title: 'Converting a photo to WebP for a website',
      description: 'Switching to a more compression-efficient modern format.',
      input: 'hero-image.png — target format WebP',
      output: 'hero-image.webp — typically 25-35% smaller than the PNG, same visual content'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Conversion happens entirely in your browser using the Canvas API (and a local HEIC decoding library for iPhone photos). Your images are never sent to a server.' },
    { question: 'Can I convert HEIC photos from my iPhone?', answer: 'Yes — HEIC and HEIF files are automatically detected and decoded before conversion, even though most browsers can\'t display them natively.' },
    { question: 'What quality setting is used?', answer: 'This tool always converts at high quality (95%) to preserve as much detail as possible. If you need more aggressive compression afterward, use the Compress Image tool.' },
    { question: 'Will converting to a format like PDF or SVG give me a true vector/document file?', answer: 'No — conversion works by rendering the image onto a canvas, so output to formats like SVG, EPS, or PDF is a rasterized image wrapped in that format, not a true vector redraw or multi-page document.' },
    { question: 'What happens to transparency when converting to JPG?', answer: 'JPEG doesn\'t support transparency, so any transparent areas are filled with a white background during conversion.' },
    { question: 'Can I convert multiple images to different formats in one go?', answer: 'No, all images in a batch are converted to the same target format together. Run the tool again with a different format selected if you need multiple output formats.' }
  ]
};
