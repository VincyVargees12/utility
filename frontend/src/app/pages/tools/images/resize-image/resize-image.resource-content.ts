import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const RESIZE_IMAGE_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Resize Image',

  whatIsTitle: 'What is Image Resizing?',
  whatIsBody: [
    'Image resizing changes the pixel dimensions of a photo — its width and height — either to a specific size or by a percentage of the original. Unlike cropping, resizing keeps the entire image visible; it just scales it up or down.',
    'Resizing is one of the most common image edits: uploaded photos are often far larger than any page or form actually needs, and shrinking them to the right dimensions reduces file size and speeds up loading, without cutting anything out of the picture.'
  ],

  whatIsToolTitle: 'What is this Resize Image tool?',
  whatIsToolBody: [
    'This is a browser-based bulk image resizer. Upload one or more images and resize them all at once, either "By pixels" (enter an exact width and height) or "By percentage" (shrink everything by 25%, 50%, or 75%).',
    'When resizing by pixels with "Maintain aspect ratio" on, the width and height you enter are treated as maximum bounds — each image is scaled to fit within them without stretching or distorting. A "Do not enlarge if smaller" option prevents small images from being blown up past their original size. Everything is processed locally on a canvas; your images are never uploaded to a server.'
  ],

  whyUseTitle: 'Why Resize Images?',
  whyUseItems: [
    'Meet upload requirements — many forms, profile pictures, and marketplaces cap the maximum pixel dimensions an image can have.',
    'Speed up a website — smaller images load faster, directly improving page speed and user experience.',
    'Standardize a batch of photos — resize an entire folder of product or listing photos to the same dimensions in one pass.',
    'Reduce file size before sharing — a photo straight from a modern phone or camera is often much larger than needed for email or messaging.',
    'Prepare images for a specific layout — fit an image to a banner, thumbnail, or template size ahead of time.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Resize by exact pixel dimensions or by percentage (25%, 50%, 75% smaller)',
    'Maintain aspect ratio automatically to avoid stretching or distortion',
    '"Do not enlarge if smaller" option to protect small images from upscaling',
    'Bulk resize — upload and process multiple images in one batch',
    'Per-image preview showing both the original and calculated output dimensions',
    'Smart handling when a batch contains images of different original sizes',
    'Download a single resized image directly, or a ZIP for multiple images',
    'Runs entirely in your browser — your photos are never uploaded to a server'
  ],

  howToTitle: 'How to Resize an Image',
  howTo: [
    { title: 'Upload your images', description: 'Click "Select images" or drag and drop one or more photos onto the upload area.' },
    { title: 'Choose a resize mode', description: 'Pick "By pixels" to set an exact width and height, or "By percentage" to shrink every image by a relative amount.' },
    { title: 'Set your dimensions', description: 'Enter the target width/height (or percentage), and toggle "Maintain aspect ratio" and "Do not enlarge if smaller" as needed.' },
    { title: 'Check the preview', description: 'Each image card shows the calculated output size next to its original dimensions.' },
    { title: 'Resize and download', description: 'Click "Resize IMAGES" to process the batch, then download the result — a single file, or a ZIP if you uploaded more than one image.' }
  ],

  commonErrorsTitle: 'Common Resize Image Errors and Pitfalls',
  commonErrors: [
    { title: 'Images look stretched or squashed', description: 'This happens when "Maintain aspect ratio" is off and the width/height you entered don\'t match the original proportions. Turn the toggle on to scale proportionally instead.' },
    { title: 'Small images enlarged and looking blurry', description: 'Entering dimensions larger than an image\'s original size will upscale it, which introduces blur since no new detail exists to fill in. Enable "Do not enlarge if smaller" to prevent this.' },
    { title: 'Mixed-size batches resized unevenly', description: 'When images of different original sizes are resized together with a fixed width/height and aspect ratio locked, the values are treated as maximum bounds rather than exact targets — check the per-image output size shown under each thumbnail.' },
    { title: 'Percentage mode surprises with mixed sizes', description: 'A 50% reduction produces a different pixel size for each image if your batch has varying original dimensions — percentage mode is relative to each image individually, not a single fixed target.' },
    { title: 'Unsupported file rejected', description: 'Only image files (JPG, PNG, WebP) are accepted — other file types are filtered out with an error message.' }
  ],

  examplesTitle: 'Resize Image Example',
  examples: [
    {
      title: 'Resizing to an exact width for a website',
      description: 'A common case: shrinking a large photo down to a fixed maximum width.',
      input: 'photo.jpg — 4032 x 3024px, target width 1200px, Maintain aspect ratio on',
      output: 'photo.jpg — 1200 x 900px (aspect ratio preserved)'
    },
    {
      title: 'Bulk resize by percentage',
      description: 'Shrinking a batch of images by a relative amount rather than a fixed pixel target.',
      input: '5 photos of varying sizes, 50% smaller',
      output: 'Each photo output at exactly half its own original width and height'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Resizing happens entirely in your browser using the Canvas API. Your images are never sent to a server.' },
    { question: 'Will resizing reduce my image quality?', answer: 'Shrinking an image (downscaling) generally looks sharp since detail is only being removed. Enlarging an image (upscaling) beyond its original size will look softer or blurry, since new detail has to be interpolated — that\'s why "Do not enlarge if smaller" exists.' },
    { question: 'What\'s the difference between resizing by pixels and by percentage?', answer: '"By pixels" lets you target an exact width and height. "By percentage" scales every image relative to its own original size — useful when your batch has different starting dimensions and you want a consistent relative reduction rather than one fixed output size.' },
    { question: 'Can I resize images to different sizes without stretching them?', answer: 'Yes — with "Maintain aspect ratio" enabled, the width and height you enter act as a maximum bounding box, and each image is scaled proportionally to fit inside it.' },
    { question: 'Can I resize multiple images at once?', answer: 'Yes, upload as many images as you like and they\'ll all be resized using the same settings in a single batch, downloadable as one ZIP file.' },
    { question: 'What file format will my resized image be?', answer: 'The output keeps the same general format family as the input — PNG stays PNG, everything else is exported as JPEG.' }
  ]
};
