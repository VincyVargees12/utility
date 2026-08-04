import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const CROP_IMAGE_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Crop Image',

  whatIsTitle: 'What is Image Cropping?',
  whatIsBody: [
    'Image cropping removes the outer parts of a photo, keeping only a chosen rectangular region. Unlike resizing, which scales the whole image, cropping cuts content away entirely — the result is a smaller image containing just the part you selected.',
    'Cropping is the fastest way to remove unwanted background, tighten a composition, change an image\'s aspect ratio for a specific use (like a square profile photo or a 16:9 banner), or isolate a subject from a larger scene.'
  ],

  whatIsToolTitle: 'What is this Crop Image tool?',
  whatIsToolBody: [
    'This is a browser-based image cropper built on an interactive selection box: upload one or more images, drag the crop handles directly on the photo (or type exact X, Y, width, and height values in the sidebar) to define the region you want to keep.',
    'Common aspect ratios — Free, 1:1, 4:3, 3:4, 16:9, and 9:16 — are one click away, locking the crop box to that proportion while you reposition it. You can zoom in for precision, and each uploaded image keeps its own independent crop selection so you can fine-tune a whole batch before exporting. Cropping happens entirely in your browser using Cropper.js and the Canvas API.'
  ],

  whyUseTitle: 'Why Crop an Image?',
  whyUseItems: [
    'Remove unwanted background or clutter — tighten the frame around your subject and cut out distracting edges.',
    'Match a required aspect ratio — crop to exactly 1:1 for a profile picture, or 16:9 for a video thumbnail or banner.',
    'Focus attention on a detail — isolate a specific part of a larger photo, like a face in a group shot or a product on a shelf.',
    'Fix framing mistakes — recompose a photo that was shot slightly too wide or off-center.',
    'Prepare consistent thumbnails — crop a batch of images to the same ratio for a uniform gallery or grid layout.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Interactive drag-to-crop selection box directly on the image',
    'Type exact X, Y, width, and height values for pixel-precise crops',
    'One-click aspect ratio presets: Free, 1:1, 4:3, 3:4, 16:9, 9:16',
    'Zoom in on the image for more precise crop placement',
    'Each uploaded image keeps its own independent crop selection',
    'Reset the crop selection back to the full image at any time',
    'Bulk cropping — process multiple images in one batch, each with its own crop area',
    'Runs entirely in your browser — your photos are never uploaded to a server'
  ],

  howToTitle: 'How to Crop an Image',
  howTo: [
    { title: 'Upload your images', description: 'Click "Select images" or drag and drop one or more photos onto the upload area.' },
    { title: 'Adjust the crop box', description: 'Drag the selection handles on the image, or enter exact X, Y, width, and height values in the sidebar.' },
    { title: 'Pick an aspect ratio (optional)', description: 'Click a preset like 1:1 or 16:9 to lock the crop box to that proportion, or leave it on "Free" for any shape.' },
    { title: 'Switch between images', description: 'If you uploaded several images, click each thumbnail to set its own crop area — your selections are remembered per image.' },
    { title: 'Crop and download', description: 'Click the crop/download button to export. A single image downloads directly; multiple images download as a ZIP.' }
  ],

  commonErrorsTitle: 'Common Crop Image Errors and Pitfalls',
  commonErrors: [
    { title: 'Cropped result looks different than expected', description: 'The crop box position and size are captured in the coordinates of the image as displayed on screen, then scaled up to the image\'s full resolution — this is handled automatically, but resizing your browser window mid-edit can occasionally shift the preview; re-check the selection before exporting.' },
    { title: 'Switching images resets an unsaved edit', description: 'Each image keeps its own crop selection, saved automatically when you switch to another image or remove one — but a crop area is only finalized once you\'ve interacted with the crop box at least once for that image.' },
    { title: 'Aspect ratio lock fights a manual resize', description: 'With a ratio like 1:1 or 16:9 selected, dragging a single handle will resize the box while keeping that proportion — if you want a completely custom shape, switch back to "Free" first.' },
    { title: 'Crop box exceeds the image bounds', description: 'The crop box is constrained to stay within the image edges — you can\'t select an area larger than the photo itself.' },
    { title: 'Unsupported file rejected', description: 'Only image files (JPG, PNG, WebP) are accepted — other file types are filtered out with an error message.' }
  ],

  examplesTitle: 'Crop Image Example',
  examples: [
    {
      title: 'Cropping a photo to a square profile picture',
      description: 'A common case: selecting the 1:1 preset and repositioning the box around a face.',
      input: 'portrait.jpg — 1600 x 1200px, 1:1 aspect ratio selected, box centered on the subject',
      output: 'portrait_cropped.jpg — a perfectly square image containing only the selected region'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Cropping happens entirely in your browser using Cropper.js and the Canvas API. Your images are never sent to a server.' },
    { question: 'What\'s the difference between cropping and resizing?', answer: 'Cropping removes part of the image, keeping only the selected region at its own resolution. Resizing scales the entire image up or down without removing any content. Use the Resize Image tool if you want to change dimensions without cutting anything out.' },
    { question: 'Can I crop multiple images to the same aspect ratio?', answer: 'Yes — select an aspect ratio preset, and it stays selected as you switch between images, though you\'ll still need to position each image\'s crop box individually.' },
    { question: 'Will cropping reduce my image quality?', answer: 'No, the cropped region is exported at its native resolution with no additional compression beyond the standard JPEG/PNG encoding, so quality is preserved.' },
    { question: 'Can I undo a crop and start over?', answer: 'Yes, use the reset control to restore the crop box to the full image, or simply adjust the handles again — nothing is finalized until you export.' },
    { question: 'Why is the resulting image a different pixel size than what I selected on screen?', answer: 'The crop box you see is displayed at your browser\'s preview size, but the actual crop is calculated against the image\'s full original resolution, so the exported file matches the proportion you selected at full quality.' }
  ]
};
