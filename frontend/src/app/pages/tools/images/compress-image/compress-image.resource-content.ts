import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const COMPRESS_IMAGE_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Compress Image',

  whatIsTitle: 'What is Image Compression?',
  whatIsBody: [
    'Image compression reduces a photo\'s file size by re-encoding it with lossy compression, discarding some visual detail that\'s least noticeable to the human eye. The pixel dimensions of the image stay the same — only the amount of data needed to store it shrinks.',
    'Most compression happens through the JPEG format\'s quality setting: a lower quality value compresses more aggressively (smaller file, more visible artifacts), while a higher quality value keeps more detail at the cost of a larger file.'
  ],

  whatIsToolTitle: 'What is this Compress Image tool?',
  whatIsToolBody: [
    'This is a browser-based image compressor. Upload one or more images, choose a compression level, and each one is re-encoded on a canvas at a quality setting tuned to that level, shrinking the file size while keeping the same dimensions.',
    'Three levels are available — Extreme (quality 0.4, smallest files), Recommended (quality 0.7, balanced), and Less (quality 0.9, closest to original) — and the tool reports the total bytes saved once processing finishes. PNGs are re-encoded as JPEG for maximum size reduction (WebP inputs stay WebP); everything runs locally, so your images never leave your browser.'
  ],

  whyUseTitle: 'Why Compress an Image?',
  whyUseItems: [
    'Speed up a website — smaller image files mean faster page loads, which directly affects user experience and search ranking.',
    'Fit under upload limits — many forms, email providers, and platforms cap the file size of an image attachment.',
    'Save storage space — shrink a large batch of photos before archiving them to free up disk or cloud storage.',
    'Reduce bandwidth costs — smaller files cost less to serve at scale, especially for image-heavy sites or apps.',
    'Share images faster over slow connections — compressed photos upload and download more quickly on limited or mobile networks.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Three compression levels: Extreme, Recommended, and Less',
    'Bulk compression — upload and process multiple images in one batch',
    'Reports total bytes saved across the whole batch after processing',
    'Automatic re-encoding to JPEG for maximum size reduction on most formats',
    'WebP files stay in WebP format after compression',
    'Live thumbnail preview and original file size shown for every uploaded image',
    'Download a single compressed image directly, or a ZIP for multiple images',
    'Runs entirely in your browser — your photos are never uploaded to a server'
  ],

  howToTitle: 'How to Compress an Image',
  howTo: [
    { title: 'Upload your images', description: 'Click "Select images" or drag and drop one or more photos onto the upload area.' },
    { title: 'Pick a compression level', description: 'Choose "Extreme compression" for the smallest file size, "Recommended compression" for a balanced result, or "Less compression" to keep quality closest to the original.' },
    { title: 'Compress the images', description: 'Click the compress/download button — each image is re-encoded at the chosen quality level.' },
    { title: 'Check the savings', description: 'The tool reports the total number of bytes saved across your batch once processing completes.' },
    { title: 'Download the result', description: 'Download the compressed image directly, or as a ZIP file if you uploaded more than one.' }
  ],

  commonErrorsTitle: 'Common Compress Image Errors and Pitfalls',
  commonErrors: [
    { title: 'PNG converted to JPEG unexpectedly', description: 'To achieve meaningful size reduction, PNG images are re-encoded as JPEG, which does not support transparency — any transparent areas will be filled in. If you need to keep transparency, this tool isn\'t the right fit for that specific image.' },
    { title: 'Visible artifacts at Extreme compression', description: 'Extreme compression uses a low quality setting (0.4) that can introduce visible blockiness, especially on images with fine detail or sharp edges — try "Recommended" or "Less compression" if quality suffers.' },
    { title: 'Little size reduction on already-compressed images', description: 'An image that\'s already been through heavy JPEG compression won\'t shrink much further, since most of the removable detail is already gone.' },
    { title: 'Filename extension mismatch', description: 'When a PNG is converted to JPEG, the output filename is automatically updated to a .jpg extension so it matches the actual file format.' },
    { title: 'Unsupported file rejected', description: 'Only image files (JPG, PNG, WebP) are accepted — other file types are filtered out with an error message.' }
  ],

  examplesTitle: 'Compress Image Example',
  examples: [
    {
      title: 'Compressing a photo for web use',
      description: 'A typical case shrinking a large photo down for faster page loading.',
      input: 'banner.png — 4.2 MB, Recommended compression',
      output: 'banner.jpg — roughly 800 KB - 1.2 MB depending on image content, same pixel dimensions'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Compression happens entirely in your browser using the Canvas API. Your images are never sent to a server.' },
    { question: 'Which compression level should I choose?', answer: '"Recommended compression" works well for most everyday use. Choose "Extreme compression" when file size matters most, or "Less compression" when preserving image quality is the priority.' },
    { question: 'Does compression change my image\'s dimensions?', answer: 'No, only the file size is reduced — the pixel width and height stay exactly the same. Use the Resize Image tool if you also want to change dimensions.' },
    { question: 'Will my PNG stay a PNG after compressing?', answer: 'No — PNGs are converted to JPEG during compression to achieve meaningful size savings, since JPEG\'s lossy compression is far more effective than PNG\'s lossless compression. This means transparency will be lost.' },
    { question: 'Can I compress multiple images at once?', answer: 'Yes, upload as many images as you like and they\'ll all be compressed at the same level in a single batch, downloadable as a ZIP file.' },
    { question: 'Why does my image still look large after compressing?', answer: 'Compression reduces file size (bytes), not necessarily the displayed size on screen, which is controlled by pixel dimensions. Combine this tool with Resize Image if you need both a smaller file size and smaller dimensions.' }
  ]
};
