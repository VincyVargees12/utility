import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const IMAGE_FILTERS_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Image Filters',

  whatIsTitle: 'What are Image Filters?',
  whatIsBody: [
    'Image filters are adjustments applied across an entire photo to change its overall look — brightness, contrast, color saturation, hue, and stylistic effects like grayscale or sepia. Unlike edits that target a specific region, a filter applies uniformly to every pixel.',
    'Filters range from simple technical corrections (making an underexposed photo brighter) to creative stylistic effects (a vintage or noir look) that give a set of photos a consistent, recognizable mood.'
  ],

  whatIsToolTitle: 'What is this Image Filters tool?',
  whatIsToolBody: [
    'This is a browser-based photo filter and adjustment tool. Upload one or more images and apply one of ten one-click presets — Grayscale, Sepia, Noir, Vintage, Cool, Warm, Vivid, Fade, Invert, or back to Original — or fine-tune the look manually with individual sliders for brightness, contrast, saturation, hue rotation, grayscale, sepia, invert, and blur.',
    'The live preview applies the exact same filter used for the final export, so what you see is what you get — there\'s no approximation between preview and result. Adjusting any slider after picking a preset switches to manual mode, letting you use a preset as a starting point and refine it further. Everything is processed locally on a canvas; your photos are never uploaded to a server.'
  ],

  whyUseTitle: 'Why Use Image Filters?',
  whyUseItems: [
    'Give a batch of photos a consistent mood — apply the same filter to an entire set for a cohesive look across a gallery or social feed.',
    'Fix exposure or color issues — brighten an underexposed photo or boost contrast on a flat-looking image.',
    'Create a stylistic effect quickly — apply a vintage, noir, or vivid look without manual color grading.',
    'Convert a photo to black and white — use the grayscale preset or slider for a classic monochrome result.',
    'Prepare images for a specific aesthetic — match a brand\'s visual style (warm tones, cool tones, faded look) across marketing photos.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Ten one-click presets: Original, Grayscale, Sepia, Noir, Vintage, Cool, Warm, Vivid, Fade, Invert',
    'Manual sliders for brightness, contrast, saturation, hue rotation, grayscale, sepia, invert, and blur',
    'Pixel-accurate live preview — the same filter applied to the preview is applied to the export',
    'Bulk filtering — apply the same filter settings to every uploaded image at once',
    'Thumbnail strip showing the filter applied to each image in the batch',
    'One-click reset back to the original, unfiltered image',
    'Download a single filtered image directly, or a ZIP for multiple images',
    'Runs entirely in your browser — your photos are never uploaded to a server'
  ],

  howToTitle: 'How to Apply a Filter to an Image',
  howTo: [
    { title: 'Upload your images', description: 'Click "Select images" or drag and drop one or more photos onto the upload area.' },
    { title: 'Pick a preset (optional)', description: 'Click a preset like Grayscale, Vintage, or Vivid to instantly apply a curated combination of adjustments.' },
    { title: 'Fine-tune manually', description: 'Adjust any of the sliders — brightness, contrast, saturation, hue rotate, grayscale, sepia, invert, or blur — to refine the look further.' },
    { title: 'Check the live preview', description: 'The large preview updates in real time and matches exactly what will be exported.' },
    { title: 'Download the result', description: 'Click "Download" to apply the filter to every uploaded image. A single image downloads directly; multiple images download as a ZIP.' }
  ],

  commonErrorsTitle: 'Common Image Filter Errors and Pitfalls',
  commonErrors: [
    { title: 'Blur looks different on-screen versus in the exported file', description: 'Blur radius is measured in pixels relative to the image\'s actual resolution, not its on-screen display size — a small blur value can look stronger in the preview if the photo is displayed smaller than its native resolution. This is a natural side effect of viewing any image at less than 100% zoom, not an error.' },
    { title: 'Colors look washed out or oversaturated', description: 'Saturation values far from 100% (very low or very high) can make colors look flat or unnaturally vivid — start with small adjustments and compare against the original using the reset button.' },
    { title: 'Preset overwritten by a slider tweak', description: 'Moving any individual slider after selecting a preset switches the tool out of "preset" mode into manual adjustment — the preset button will no longer show as selected, even though most of its values are still applied, since you\'re now fine-tuning from that starting point.' },
    { title: 'Grayscale and Invert combined unexpectedly', description: 'Grayscale, sepia, and invert can all be layered together with the sliders, which can produce unexpected results if combined at high values — reset and apply one at a time if you want a predictable, single effect.' },
    { title: 'Unsupported file rejected', description: 'Only image files (JPG, PNG, WebP) are accepted — other file types are filtered out with an error message.' }
  ],

  examplesTitle: 'Image Filters Example',
  examples: [
    {
      title: 'Applying a vintage look to a batch of photos',
      description: 'Using the Vintage preset for a consistent warm, faded aesthetic.',
      input: '8 event photos, Vintage preset (sepia 50%, contrast 90%, brightness 105%, saturation 80%)',
      output: '8 photos with a consistent warm, slightly faded vintage look'
    },
    {
      title: 'Converting a photo to black and white',
      description: 'Using the Grayscale preset for a classic monochrome result.',
      input: 'portrait.jpg, Grayscale preset (grayscale 100%)',
      output: 'portrait.jpg fully desaturated to black and white, same dimensions'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Filtering happens entirely in your browser using the Canvas API. Your photos are never sent to a server.' },
    { question: 'Does the preview match the final downloaded image exactly?', answer: 'Yes — the preview and export both use the same CSS/Canvas filter syntax, so the live preview is pixel-accurate to what you\'ll download (aside from blur\'s natural dependence on display versus native resolution).' },
    { question: 'Can I combine a preset with my own adjustments?', answer: 'Yes — click a preset to use it as a starting point, then move any slider to fine-tune from there. The tool switches to manual mode once you adjust a slider.' },
    { question: 'Can I apply the same filter to multiple images?', answer: 'Yes, upload a batch of images and the same filter settings are applied to every one when you download, saved as a ZIP file.' },
    { question: 'How do I go back to the original, unfiltered image?', answer: 'Click "Reset to original" or select the "Original" preset to clear every adjustment back to its default value.' },
    { question: 'Will filtering reduce my image quality?', answer: 'Filters adjust color and tone, not resolution — the pixel dimensions stay the same. The final export uses standard JPEG/PNG encoding, so quality is otherwise preserved.' }
  ]
};
