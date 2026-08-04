import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const TO_WEBP_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Convert to WebP',

  whatIsTitle: 'What is WebP?',
  whatIsBody: [
    'WebP is a modern image format developed by Google that typically produces significantly smaller files than JPEG or PNG at a comparable visual quality. It supports both lossy compression (like JPEG) and lossless compression with transparency (like PNG), making it a flexible replacement for either.',
    'Because WebP compresses more efficiently, converting existing JPG or PNG images to WebP is one of the easiest ways to shrink file sizes — and by extension speed up page loads — without a visible drop in quality. It\'s supported by all major modern browsers.'
  ],

  whatIsToolTitle: 'What is this Convert to WebP tool?',
  whatIsToolBody: [
    'This is a browser-based converter dedicated to turning any image format (JPG, PNG, GIF, BMP, and more) into WebP. Upload one or more images, choose a quality level (Low, Medium, or High), and each one is redrawn onto a canvas and re-encoded as WebP.',
    'This tool focuses specifically on converting to WebP — for converting between other format pairs, use the general Convert Image tool. Everything runs locally in your browser; your files are never uploaded to a server.'
  ],

  whyUseTitle: 'Why Convert to WebP?',
  whyUseItems: [
    'Shrink file sizes dramatically — WebP often reduces file size by up to 80% compared to the original format, at similar visual quality.',
    'Speed up your website — smaller image files mean faster page loads, which improves both user experience and search ranking.',
    'Save bandwidth and storage — smaller files cost less to serve and store, especially at scale.',
    'Keep transparency in a smaller file — unlike JPEG, WebP supports transparency while still compressing more efficiently than PNG.',
    'Modernize an image-heavy site — most current browsers support WebP natively, making it a safe, widely compatible upgrade from JPEG or PNG.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Convert any supported image format (JPG, PNG, GIF, BMP, and more) to WebP',
    'Three quality presets: Low, Medium, and High',
    'Bulk conversion — upload and convert multiple images in a single batch',
    'Live preview and dimensions shown for every uploaded file',
    'Output filenames automatically updated with a .webp extension',
    'Download a single converted image directly, or a ZIP for multiple images',
    'Runs entirely in your browser — your photos are never uploaded to a server'
  ],

  howToTitle: 'How to Convert an Image to WebP',
  howTo: [
    { title: 'Upload your images', description: 'Click "Select images" or drag and drop one or more image files onto the upload area.' },
    { title: 'Choose a quality level', description: 'Pick Low, Medium, or High depending on how much you want to prioritize file size versus visual quality.' },
    { title: 'Convert the images', description: 'Click the convert/download button — each image is redrawn on a canvas and re-encoded as WebP.' },
    { title: 'Download the result', description: 'A single converted image downloads directly; multiple images download together as a ZIP file.' }
  ],

  commonErrorsTitle: 'Common Convert to WebP Errors and Pitfalls',
  commonErrors: [
    { title: 'Older software not opening WebP files', description: 'While all modern browsers support WebP, some older image viewers, editors, or operating system versions may not open it directly — check that your target destination supports WebP before relying on it exclusively.' },
    { title: 'Expecting further size reduction from an already-small image', description: 'Simple graphics or icons that are already very small won\'t shrink much further, since there\'s limited redundant data left to compress out.' },
    { title: 'Low quality introducing visible artifacts', description: 'The "Low" quality preset compresses more aggressively and can introduce visible softness or blockiness on images with fine detail — try "Medium" or "High" if this happens.' },
    { title: 'Unsupported file rejected', description: 'Only image files are accepted — non-image files are filtered out with an error message.' },
    { title: 'Large batches taking longer to process', description: 'Converting many large images at once can take noticeably longer since each one is individually redrawn and re-encoded — let it finish rather than reloading the page.' }
  ],

  examplesTitle: 'Convert to WebP Example',
  examples: [
    {
      title: 'Converting a JPG photo for a faster website',
      description: 'A typical case shrinking an image for web use without a visible quality drop.',
      input: 'hero-banner.jpg — 1.8 MB, High quality',
      output: 'hero-banner.webp — often 400-700 KB, visually comparable quality'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Conversion happens entirely in your browser using the Canvas API. Your images are never sent to a server.' },
    { question: 'Which quality setting should I choose?', answer: '"High" (0.95) is a strong default that preserves quality while still benefiting from WebP\'s efficient compression. Choose "Medium" (0.8) or "Low" (0.6) if you want to prioritize file size further.' },
    { question: 'Does WebP support transparency?', answer: 'Yes, WebP supports transparency similarly to PNG, but typically compresses transparent images to a smaller file size.' },
    { question: 'Is WebP supported everywhere?', answer: 'All major modern browsers (Chrome, Firefox, Safari, Edge) support WebP natively. Some older software or specific editing tools may have limited support, so check your target use case if compatibility is a concern.' },
    { question: 'Can I convert multiple images to WebP at once?', answer: 'Yes, upload as many images as you like and they\'ll all be converted at the same quality setting in a single batch, downloadable as a ZIP file.' },
    { question: 'Will converting to WebP change my image dimensions?', answer: 'No, the pixel width and height stay exactly the same — only the format and file size change.' }
  ]
};
