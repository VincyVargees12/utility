import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const PNG_TO_JPG_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'PNG to JPG',

  whatIsTitle: 'What is PNG to JPG Conversion?',
  whatIsBody: [
    'PNG to JPG conversion changes an image from PNG\'s lossless format to JPEG\'s lossy, compressed format. PNG preserves every pixel exactly and supports transparency, but that comes at the cost of larger file sizes — JPEG trades a small amount of visual detail for dramatically smaller files.',
    'Since JPEG doesn\'t support transparency, any transparent areas in the source PNG are filled with a solid background (typically white) during conversion — the result is always a fully opaque, rectangular image.'
  ],

  whatIsToolTitle: 'What is this PNG to JPG tool?',
  whatIsToolBody: [
    'This is a browser-based converter dedicated to turning PNG images into JPG. Upload one or more PNG files, choose a quality level (Low, Normal, or High), and each image is redrawn onto a white-background canvas and re-encoded as JPEG.',
    'This is a focused, single-purpose version of image conversion — if you need to convert between other formats too, the general Convert Image tool supports 15+ formats. Everything here runs locally in your browser; your files are never uploaded to a server.'
  ],

  whyUseTitle: 'Why Convert PNG to JPG?',
  whyUseItems: [
    'Reduce file size significantly — JPEG compression typically produces much smaller files than PNG for photographic content.',
    'Meet upload requirements — some forms, platforms, or systems only accept JPG files.',
    'Speed up a website — smaller JPG files load faster than equivalent PNGs, especially for photos.',
    'Simplify sharing — JPG is the most universally compatible image format across devices, apps, and print services.',
    'Prepare a photo for email or messaging — smaller JPGs are quicker to attach and send than large PNGs.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Convert one or many PNG files to JPG in a single batch',
    'Three quality presets: Low, Normal, and High',
    'Automatically fills transparent areas with a white background',
    'Live preview and dimensions shown for every uploaded file',
    'Output filenames automatically updated with a .jpg extension',
    'Download a single converted image directly, or a ZIP for multiple images',
    'Runs entirely in your browser — your images are never uploaded to a server'
  ],

  howToTitle: 'How to Convert PNG to JPG',
  howTo: [
    { title: 'Upload your PNG files', description: 'Click "Select images" or drag and drop one or more PNG files onto the upload area.' },
    { title: 'Choose a quality level', description: 'Pick Low, Normal, or High depending on how much you want to prioritize file size versus visual quality.' },
    { title: 'Convert the images', description: 'Click the convert/download button to redraw each PNG onto a white background and re-encode it as JPEG.' },
    { title: 'Download the result', description: 'A single converted image downloads directly; multiple images download together as a ZIP file.' }
  ],

  commonErrorsTitle: 'Common PNG to JPG Errors and Pitfalls',
  commonErrors: [
    { title: 'Transparent areas turn white', description: 'JPEG has no concept of transparency, so any transparent or semi-transparent pixels in the source PNG are filled with a solid white background during conversion — this is expected, not a bug.' },
    { title: 'Non-PNG files rejected', description: 'This tool only accepts files with the PNG format specifically — JPGs, WebPs, or other formats are filtered out with an error message. Use the general Convert Image tool for other format conversions.' },
    { title: 'Low quality introducing visible artifacts', description: 'The "Low" quality preset compresses more aggressively and can introduce visible blockiness on images with sharp edges or fine detail, such as screenshots or graphics with text — try "Normal" or "High" if this happens.' },
    { title: 'Expecting a smaller file on already-simple images', description: 'For images with large flat areas of solid color (like simple logos or icons), PNG\'s lossless compression can sometimes already be quite small — JPEG conversion may not shrink the file much, or could even increase it slightly.' },
    { title: 'Sharp text or line art looking soft', description: 'JPEG compression is optimized for photographic content and can slightly blur crisp edges, which matters most for screenshots, diagrams, or text-heavy PNGs — for those, PNG\'s lossless format is usually the better choice to keep.' }
  ],

  examplesTitle: 'PNG to JPG Example',
  examples: [
    {
      title: 'Converting a screenshot for smaller file size',
      description: 'A typical case reducing a large PNG down for easier sharing.',
      input: 'screenshot.png — 3.1 MB, 1920x1080px, Normal quality',
      output: 'screenshot.jpg — roughly 300-600 KB, same 1920x1080px dimensions'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Conversion happens entirely in your browser using the Canvas API. Your images are never sent to a server.' },
    { question: 'What happens to transparency in my PNG?', answer: 'JPEG doesn\'t support transparency, so any transparent areas are filled with a solid white background during conversion. If you need to keep transparency, keep the file as PNG.' },
    { question: 'Which quality setting should I choose?', answer: '"Normal" (quality 0.85) is a good default balance. Choose "High" (0.95) when visual quality matters most, or "Low" (0.75) when file size is the priority and some quality loss is acceptable.' },
    { question: 'Can I convert multiple PNG files at once?', answer: 'Yes, upload as many PNG files as you like and they\'ll all be converted at the same quality setting in a single batch, downloadable as a ZIP file.' },
    { question: 'Will converting change my image dimensions?', answer: 'No, the pixel width and height stay exactly the same — only the format and compression change.' },
    { question: 'What if I need to convert to a format other than JPG?', answer: 'This tool is dedicated to PNG-to-JPG conversion specifically. For other formats (WebP, GIF, BMP, HEIC, and more), use the general Convert Image tool.' }
  ]
};
