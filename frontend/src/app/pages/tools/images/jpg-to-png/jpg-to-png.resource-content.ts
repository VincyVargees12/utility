import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const JPG_TO_PNG_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'JPG to PNG',

  whatIsTitle: 'What is JPG to PNG Conversion?',
  whatIsBody: [
    'JPG to PNG conversion changes an image from JPEG\'s lossy, compressed format to PNG\'s lossless format. The conversion itself can\'t recover detail that JPEG compression already discarded, but from that point forward, PNG preserves every pixel exactly with no further quality loss on repeated saves.',
    'PNG also supports transparency, which JPEG does not — so converting to PNG is often the first step before editing an image in a tool that needs a transparent background, even though the original JPG source won\'t contain any transparency to begin with.'
  ],

  whatIsToolTitle: 'What is this JPG to PNG tool?',
  whatIsToolBody: [
    'This is a browser-based converter dedicated to turning JPG images into PNG. Upload one or more JPG files, choose a quality level (Low, Medium, or High), and each image is redrawn onto a canvas and re-encoded as lossless PNG.',
    'This is a focused, single-purpose version of image conversion — if you need to convert between other formats too, the general Convert Image tool supports 15+ formats. Everything runs locally in your browser; your files are never uploaded to a server.'
  ],

  whyUseTitle: 'Why Convert JPG to PNG?',
  whyUseItems: [
    'Prepare for lossless editing — convert to PNG before making further edits in another tool, so repeated saves don\'t introduce additional compression artifacts.',
    'Meet upload requirements — some forms, platforms, or design tools only accept PNG files.',
    'Add transparency later — start from a PNG if your next step is removing the background or layering the image over other content.',
    'Preserve sharp edges and text — PNG\'s lossless compression keeps crisp lines and text free of the softening JPEG can introduce.',
    'Standardize a batch to one format — convert a mixed set of images to PNG for consistent handling in another workflow.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Convert one or many JPG files to PNG in a single batch',
    'Three quality presets: Low, Medium, and High, controlling the intermediate re-render',
    'Live preview and dimensions shown for every uploaded file',
    'Output filenames automatically updated with a .png extension',
    'Download a single converted image directly, or a ZIP for multiple images',
    'Runs entirely in your browser — your images are never uploaded to a server'
  ],

  howToTitle: 'How to Convert JPG to PNG',
  howTo: [
    { title: 'Upload your JPG files', description: 'Click "Select images" or drag and drop one or more JPG/JPEG files onto the upload area.' },
    { title: 'Choose a quality level', description: 'Pick Low, Medium, or High for the intermediate rendering step before the lossless PNG encode.' },
    { title: 'Convert the images', description: 'Click the convert/download button to redraw each JPG onto a canvas and re-encode it as PNG.' },
    { title: 'Download the result', description: 'A single converted image downloads directly; multiple images download together as a ZIP file.' }
  ],

  commonErrorsTitle: 'Common JPG to PNG Errors and Pitfalls',
  commonErrors: [
    { title: 'Expecting quality to improve after conversion', description: 'Converting to PNG cannot restore detail that JPEG compression already removed from the original file — the PNG will look exactly as sharp (or soft) as the source JPG, just without further compression going forward.' },
    { title: 'File size increases significantly', description: 'PNG\'s lossless compression generally produces larger files than JPEG for photographic content — this is expected, and is the trade-off for lossless quality preservation.' },
    { title: 'Non-JPG files rejected', description: 'This tool only accepts files with the JPG/JPEG format specifically — PNGs, WebPs, or other formats are filtered out with an error message. Use the general Convert Image tool for other format conversions.' },
    { title: 'Expecting automatic transparency', description: 'Converting a JPG to PNG does not add transparency — the source JPG has a fully opaque background, so the resulting PNG will too, unless you separately remove the background using a tool like Remove Background.' },
    { title: 'Large batches taking longer to process', description: 'PNG encoding is more computationally intensive than JPEG, so converting many large images at once can take noticeably longer — let it finish rather than reloading the page.' }
  ],

  examplesTitle: 'JPG to PNG Example',
  examples: [
    {
      title: 'Converting a photo for lossless editing',
      description: 'A typical case preparing an image for further editing without repeated compression loss.',
      input: 'photo.jpg — 1.2 MB, 1920x1080px, High quality',
      output: 'photo.png — larger file (often several MB), same 1920x1080px dimensions, lossless from this point forward'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Conversion happens entirely in your browser using the Canvas API. Your images are never sent to a server.' },
    { question: 'Will converting to PNG improve my image quality?', answer: 'No — conversion can\'t recover detail already lost to JPEG compression. What it does is stop further quality loss: from the PNG onward, saves are lossless.' },
    { question: 'Does the converted PNG have a transparent background?', answer: 'No, JPG source images have no transparency information, so the resulting PNG is fully opaque, just like the original. Use the Remove Background tool separately if you need transparency.' },
    { question: 'Why is my PNG file so much bigger than the original JPG?', answer: 'PNG uses lossless compression, which generally produces larger files than JPEG\'s lossy compression, especially for photos. This is a normal and expected trade-off for zero quality loss.' },
    { question: 'Can I convert multiple JPG files at once?', answer: 'Yes, upload as many JPG files as you like and they\'ll all be converted in a single batch, downloadable as a ZIP file.' },
    { question: 'What if I need to convert to a format other than PNG?', answer: 'This tool is dedicated to JPG-to-PNG conversion specifically. For other formats (WebP, GIF, BMP, HEIC, and more), use the general Convert Image tool.' }
  ]
};
