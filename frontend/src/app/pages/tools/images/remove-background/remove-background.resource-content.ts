import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const REMOVE_BACKGROUND_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Remove Background',

  whatIsTitle: 'What is Background Removal?',
  whatIsBody: [
    'Background removal isolates the main subject of a photo — a person, product, or object — from everything behind it, producing an image with a transparent background. It relies on identifying which pixels belong to the subject and which belong to the background, then erasing the latter.',
    'Modern background removal uses machine learning models trained to recognize subject boundaries automatically, without needing a green screen or manual pixel-by-pixel selection — the kind of automatic, one-click removal this tool performs directly in your browser.'
  ],

  whatIsToolTitle: 'What is this Remove Background tool?',
  whatIsToolBody: [
    'This is a browser-based background remover powered by an AI segmentation model that runs entirely on your device — no photo is ever uploaded to a server. Upload one or more images and the background is automatically detected and removed, leaving a transparent PNG.',
    'Once the background is removed, you can replace it: keep it transparent, fill it with a solid color, apply a blur to the original background instead of removing it, or drop in a custom background image with adjustable scale and position. A live preview shows the result before you download.'
  ],

  whyUseTitle: 'Why Remove a Background?',
  whyUseItems: [
    'Create product photos — isolate a product on a transparent background for an online store listing or catalog.',
    'Make a profile picture stand out — replace a cluttered background with a clean color or blur.',
    'Build design assets — cut a subject out of a photo to place it into a graphic, presentation, or composite image.',
    'Swap in a new setting — replace the original background entirely with a custom image.',
    'Simplify a busy photo — blur a distracting background while keeping the subject sharp, without full removal.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Automatic AI-powered background removal — no manual selection needed',
    'Four background options after removal: transparent, solid color, blurred original, or custom image',
    'Preset color swatches plus a full custom color picker',
    'Adjustable blur amount for the "blur original background" mode',
    'Custom background image with adjustable scale and position',
    'Bulk processing — remove backgrounds from multiple images in one batch',
    'Live preview with a thumbnail strip for switching between images',
    'Runs entirely in your browser — your photos are never uploaded to a server'
  ],

  howToTitle: 'How to Remove a Background from an Image',
  howTo: [
    { title: 'Upload your images', description: 'Click "Select images" or drag and drop one or more photos onto the upload area. Background removal starts automatically and shows live progress.' },
    { title: 'Review the result', description: 'Once processing finishes, each image shows with its background removed on a transparent (checkered) canvas.' },
    { title: 'Choose a background option', description: 'Keep it transparent, pick a solid color, blur the original background, or upload a custom background image.' },
    { title: 'Fine-tune if needed', description: 'Adjust the blur amount, or the scale and position of a custom background image, using the live preview to guide you.' },
    { title: 'Download the result', description: 'Download a single processed image directly, or a ZIP file if you uploaded more than one.' }
  ],

  commonErrorsTitle: 'Common Remove Background Errors and Pitfalls',
  commonErrors: [
    { title: 'Fine details like hair or fur look imperfect', description: 'AI background removal does its best with fine, wispy edges (hair, fur, transparent fabric), but some softening or minor loss of detail around these areas is a known limitation of automatic segmentation, not a processing error.' },
    { title: 'Part of the subject removed by mistake', description: 'Low-contrast boundaries between the subject and background (e.g. a white shirt against a white wall) can confuse the model and cause it to remove part of the subject — a photo with a clearer subject/background distinction generally segments more accurately.' },
    { title: 'Processing takes a while on first use', description: 'The AI model must be downloaded to your browser the first time you use the tool, which can take a few extra moments — subsequent images process faster since the model is already loaded.' },
    { title: 'JPG background export looks unexpected', description: 'When downloading with a transparent background selected, the file is exported as PNG (the only common format supporting transparency) — choosing a solid color, blur, or custom image background still lets you export normally.' },
    { title: 'Unsupported file rejected', description: 'Only image files are accepted — other file types are filtered out with an error message.' }
  ],

  examplesTitle: 'Remove Background Example',
  examples: [
    {
      title: 'Isolating a product for an online listing',
      description: 'A typical case producing a clean, transparent product photo.',
      input: 'shoe-photo.jpg — original photo on a cluttered desk background',
      output: 'shoe-photo_no-bg.png — subject isolated on a fully transparent background'
    },
    {
      title: 'Replacing a background with a solid color',
      description: 'Removing the original background and filling it with a chosen color instead.',
      input: 'portrait.jpg, background removed, solid white (#ffffff) selected',
      output: 'portrait_no-bg.png — subject on a clean white background, ready for a profile photo'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Background removal runs entirely in your browser using an on-device AI model. Your photos are never sent to a server.' },
    { question: 'Why does the first image take longer to process than the rest?', answer: 'The AI segmentation model needs to be downloaded to your browser the first time you use the tool. Once loaded, subsequent images in the same session process faster.' },
    { question: 'What file format is the output?', answer: 'When the background is transparent, the result is exported as PNG, since that\'s the standard format supporting transparency. Other background options (color, blur, custom image) fill the transparent area before export.' },
    { question: 'Can I remove backgrounds from multiple photos at once?', answer: 'Yes, upload a batch of images and each one is processed automatically; download them all together as a ZIP file.' },
    { question: 'Can I replace the background instead of just removing it?', answer: 'Yes — after removal, choose a solid color, a blurred version of the original background, or upload a completely custom background image, with adjustable scale and position.' },
    { question: 'Will the subject\'s edges look perfectly clean?', answer: 'For most photos, yes — but very fine details like loose hair strands or semi-transparent materials can show minor softening, which is a normal limitation of automatic AI segmentation rather than a bug.' }
  ]
};
