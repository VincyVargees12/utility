import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const FLIP_IMAGE_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Flip Image',

  whatIsTitle: 'What is Image Flipping?',
  whatIsBody: [
    'Image flipping mirrors a photo across an axis — horizontally (left becomes right) or vertically (top becomes bottom) — without changing its pixel dimensions. Unlike rotation, which turns an image around its center, flipping creates a mirror-image reflection.',
    'A horizontal flip is the most common: it\'s the same transformation you see in a mirror, often used to correct a "selfie" photo that appears reversed, or to change which direction a subject appears to be facing.'
  ],

  whatIsToolTitle: 'What is this Flip Image tool?',
  whatIsToolBody: [
    'This is a browser-based image flipping tool. Upload one or more images and flip each one horizontally, vertically, or both, independently, using the controls on each image thumbnail — or flip every image in the batch at once with the "Flip all" buttons.',
    'Each flip toggles on or off, so clicking horizontal flip twice returns the image to its original orientation. The transformation is applied on a canvas at export time; your images are never uploaded to a server.'
  ],

  whyUseTitle: 'Why Flip an Image?',
  whyUseItems: [
    'Correct a mirrored selfie — front-facing phone cameras often preview (and sometimes save) photos mirrored; flipping horizontally fixes text or asymmetric features to appear as they truly are.',
    'Change which way a subject faces — mirror a photo so a person or object appears to look/move in the opposite direction, useful for design layouts.',
    'Create a symmetrical or mirrored design element — flip a graphic to pair with its original for a symmetric composition.',
    'Fix an accidentally mirrored scan or export — some scanners or software save images flipped by mistake.',
    'Combine with rotation for a full reorientation — flipping plus rotating covers every possible orientation correction.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Flip images horizontally, vertically, or both, independently per image',
    '"Flip all" buttons to mirror every image in a batch at once',
    'Each flip toggles on/off — click again to undo it',
    'Bulk flipping — process multiple images in one batch',
    'Live preview shows the current flip state of each image',
    'Preserves original pixel dimensions — flipping never changes width or height',
    'Runs entirely in your browser — your photos are never uploaded to a server'
  ],

  howToTitle: 'How to Flip an Image',
  howTo: [
    { title: 'Upload your images', description: 'Click "Select images" or drag and drop one or more photos onto the upload area.' },
    { title: 'Flip individual images', description: 'Use the horizontal or vertical flip controls on each image thumbnail to mirror it independently.' },
    { title: 'Or flip the whole batch', description: 'Use "Flip all horizontal" or "Flip all vertical" to mirror every uploaded image at once.' },
    { title: 'Combine flips if needed', description: 'Apply both horizontal and vertical flips to the same image for a 180°-equivalent mirror effect.' },
    { title: 'Export and download', description: 'Click the flip/download button to process the batch. A single image downloads directly; multiple images download as a ZIP.' }
  ],

  commonErrorsTitle: 'Common Flip Image Errors and Pitfalls',
  commonErrors: [
    { title: 'Confusing flip with rotate', description: 'Flipping mirrors an image across an axis (left-right or top-bottom); it does not turn the image like rotation does. If you need to correct a sideways or upside-down photo, use the Rotate Image tool instead.' },
    { title: 'Text or watermarks appear backward', description: 'Flipping mirrors everything in the frame, including any text, logos, or watermarks already in the photo — they\'ll read backward after a horizontal flip, which is expected since the whole image is mirrored.' },
    { title: 'Double-flipping by accident', description: 'Each flip toggle is a switch, not a one-time action — clicking horizontal flip a second time undoes it and returns the image to normal, which can look like "nothing happened" if clicked twice quickly.' },
    { title: 'Flip all affecting unwanted images', description: 'The "Flip all" buttons apply to every uploaded image in the batch — if you only want to flip a few, use the per-image controls instead.' },
    { title: 'Unsupported file rejected', description: 'Only image files (JPG, PNG, WebP, GIF) are accepted — other file types are filtered out with an error message.' }
  ],

  examplesTitle: 'Flip Image Example',
  examples: [
    {
      title: 'Correcting a mirrored selfie',
      description: 'A front-camera photo that appears reversed compared to reality.',
      input: 'selfie.jpg — flipped horizontally',
      output: 'selfie_flipped.jpg — same dimensions, mirrored left-to-right so text/asymmetry reads correctly'
    },
    {
      title: 'Combining both flip directions',
      description: 'Applying horizontal and vertical flip together for a full mirror effect.',
      input: 'graphic.png — flipped horizontally and vertically',
      output: 'graphic_flipped.png — equivalent to a 180° rotation, mirrored on both axes'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Flipping happens entirely in your browser using the Canvas API. Your images are never sent to a server.' },
    { question: 'What\'s the difference between flipping and rotating?', answer: 'Flipping mirrors an image across an axis, like a reflection — nothing turns, it just reverses. Rotating turns the image around its center point. For a sideways or upside-down photo, use the Rotate Image tool; for a mirrored effect, use Flip.' },
    { question: 'Can I flip both horizontally and vertically at the same time?', answer: 'Yes, both flips can be applied to the same image together, which produces a result equivalent to rotating the image 180°.' },
    { question: 'Does flipping affect image quality?', answer: 'No, flipping only repositions existing pixels — it doesn\'t resample or compress the image beyond the standard export encoding, so quality is preserved.' },
    { question: 'Can I flip multiple images at once?', answer: 'Yes — use the "Flip all horizontal" or "Flip all vertical" buttons to mirror every uploaded image in the batch in one click, or flip images individually.' },
    { question: 'How do I undo a flip?', answer: 'Click the same flip control again — each flip is a toggle, so clicking it a second time returns the image to its original orientation.' }
  ]
};
