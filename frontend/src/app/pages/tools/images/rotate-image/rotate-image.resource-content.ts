import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const ROTATE_IMAGE_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Rotate Image',

  whatIsTitle: 'What is Image Rotation?',
  whatIsBody: [
    'Image rotation turns a photo around its center point, most commonly in 90-degree steps, so it displays in the correct orientation. A photo taken with a camera or phone held sideways, or an image that was imported upside-down, can be straightened without needing to retake or re-scan it.',
    'Rotating by 90° or 270° swaps the image\'s width and height (a portrait photo becomes landscape, or vice versa), while 180° keeps the same dimensions but flips the content end-to-end.'
  ],

  whatIsToolTitle: 'What is this Rotate Image tool?',
  whatIsToolBody: [
    'This is a browser-based image rotation tool. Upload one or more images and rotate each one 90° left or right, independently, by hovering over its thumbnail and clicking the rotate icons — repeat clicks add up to reach 180° or 270°.',
    'Each image tracks its own rotation angle, so a mixed batch of sideways and upside-down photos can all be corrected individually in one session before downloading. Rotation is rendered on a canvas, and the output dimensions automatically swap for 90°/270° rotations to match the new orientation.'
  ],

  whyUseTitle: 'Why Rotate an Image?',
  whyUseItems: [
    'Fix sideways photos — correct images taken with a phone or camera held at 90 degrees.',
    'Straighten upside-down scans — fix a document or photo that was scanned or imported backward.',
    'Standardize orientation across a batch — make sure every photo in a folder displays upright and consistently.',
    'Prepare images for a specific layout — rotate a landscape photo to portrait (or vice versa) to fit a template.',
    'Correct camera EXIF quirks — some devices save photos with orientation metadata that isn\'t respected everywhere; rotating and re-exporting bakes the correct orientation directly into the pixels.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Rotate images 90° left or right, repeatable to reach any multiple of 90°',
    'Each uploaded image tracks its own independent rotation angle',
    'Hover-to-reveal rotate controls directly on each image thumbnail',
    'Bulk rotation — rotate and export an entire batch of images in one session',
    'Output dimensions automatically adjust for 90°/270° rotations',
    'Live preview shows the current rotation applied to each image',
    'Runs entirely in your browser — your photos are never uploaded to a server'
  ],

  howToTitle: 'How to Rotate an Image',
  howTo: [
    { title: 'Upload your images', description: 'Click "Select images" or drag and drop one or more photos onto the upload area.' },
    { title: 'Rotate as needed', description: 'Hover over an image and click the rotate-left or rotate-right icon; click again to keep rotating in 90° steps until the orientation looks correct.' },
    { title: 'Check each image', description: 'If you uploaded a batch, repeat for any other images that need straightening — each keeps its own rotation independently.' },
    { title: 'Export the batch', description: 'Click the rotate/download button to process every image at its current rotation angle.' },
    { title: 'Download the result', description: 'A single image downloads directly; multiple rotated images download individually or as a set.' }
  ],

  commonErrorsTitle: 'Common Rotate Image Errors and Pitfalls',
  commonErrors: [
    { title: 'Rotated the wrong number of times', description: 'Since rotation moves in 90° steps, it\'s easy to overshoot — if an image ends up upside-down, you\'ve gone 180° off; two more clicks in the same direction (or two in the opposite direction) will correct it.' },
    { title: 'Expecting a custom angle', description: 'This tool rotates in fixed 90° increments only — for a small tilt correction (like straightening a slightly crooked horizon), you\'d need dedicated fine-angle rotation, which isn\'t what quarter-turn rotation is designed for.' },
    { title: 'Width and height swap unexpectedly', description: 'Rotating an image 90° or 270° swaps its width and height by design — a 1200x800 landscape photo becomes an 800x1200 portrait photo after a quarter turn. This is expected, not an error.' },
    { title: 'Forgetting to rotate every image in a batch', description: 'Each image keeps its own rotation independently — uploading several photos doesn\'t rotate them all together, so double-check every thumbnail before exporting.' },
    { title: 'Unsupported file rejected', description: 'Only image files (JPG, PNG, WebP, GIF) are accepted — other file types are filtered out with an error message.' }
  ],

  examplesTitle: 'Rotate Image Example',
  examples: [
    {
      title: 'Fixing a sideways phone photo',
      description: 'A photo taken with the phone rotated 90° that needs to display upright.',
      input: 'IMG_0231.jpg — 3024 x 4032px (portrait), rotated 90° right once',
      output: 'IMG_0231-rotated.jpg — 4032 x 3024px (landscape), now displaying correctly'
    },
    {
      title: 'Correcting an upside-down image',
      description: 'An image imported or scanned backward.',
      input: 'scan.png — rotated 90° right twice (180° total)',
      output: 'scan-rotated.png — same dimensions, content flipped end-to-end to read correctly'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Rotation happens entirely in your browser using the Canvas API. Your images are never sent to a server.' },
    { question: 'Can I rotate by a custom angle, like 15 degrees?', answer: 'No, this tool rotates in fixed 90° steps only (90°, 180°, 270°). It\'s designed for correcting sideways or upside-down orientation, not fine-tuning a slight tilt.' },
    { question: 'Does rotating reduce image quality?', answer: 'No, rotation only repositions existing pixels — it doesn\'t resample or compress the image beyond the standard export encoding, so quality is preserved.' },
    { question: 'Why did my image\'s width and height change?', answer: 'A 90° or 270° rotation swaps orientation, so width and height are swapped to match — this is correct behavior, not a bug. A 180° rotation keeps the same dimensions.' },
    { question: 'Can I rotate several images at once?', answer: 'Yes, upload a batch and rotate each one independently — every image remembers its own rotation angle until you export.' },
    { question: 'How do I undo a rotation?', answer: 'Click the rotate button in the opposite direction the same number of times to return to the original orientation.' }
  ]
};
