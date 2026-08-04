import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const WATERMARK_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Watermark',

  whatIsTitle: 'What is a Watermark?',
  whatIsBody: [
    'A watermark is text or a logo overlaid onto an image, usually semi-transparent, to identify its owner or source and discourage unauthorized use. Watermarks are common on photography portfolios, stock images, social media exports, and any photo shared publicly before a final, unwatermarked version is sold or delivered.',
    'A good watermark strikes a balance: visible enough to make the image hard to reuse cleanly, but subtle enough not to overwhelm the photo itself — which is why position, opacity, size, and rotation are all adjustable rather than fixed.'
  ],

  whatIsToolTitle: 'What is this Watermark tool?',
  whatIsToolBody: [
    'This is a browser-based watermarking tool supporting both text and image (logo) watermarks. Upload one or more photos, choose Text or Image/Logo mode, and customize the watermark\'s position, opacity, rotation, and edge margin — with a live preview showing exactly how it will look before you commit.',
    'Text watermarks let you set the content, color, font, weight, and size (as a percentage of the image width, so it scales consistently across images of different sizes). Image watermarks let you upload a logo and set its size the same way. The same watermark settings are applied to every uploaded image, composited onto a canvas at export time — your photos are never uploaded to a server.'
  ],

  whyUseTitle: 'Why Watermark Your Images?',
  whyUseItems: [
    'Protect your work — deter unauthorized use of photos or graphics you share publicly, such as a portfolio or social media preview.',
    'Brand your content — stamp a logo or business name onto product photos, marketing images, or social posts for consistent recognition.',
    'Attribute ownership — mark photos with a copyright notice or your name before sharing proofs with a client.',
    'Discourage reuse of previews — apply a visible watermark to preview images so a full-resolution, unwatermarked version remains the deliverable.',
    'Add consistent branding across a batch — apply the same logo watermark to an entire set of product or event photos at once.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Text watermarks with custom content, color, font, bold weight, and size',
    'Image/logo watermarks with adjustable size, uploaded from your own file',
    '9-point position picker (corners, edges, and center)',
    'Adjustable opacity, rotation, and edge margin, shared by both watermark types',
    'Live preview showing exactly how the watermark will look before exporting',
    'Bulk watermarking — apply the same watermark to every uploaded image at once',
    'Thumbnail strip to switch between images while keeping one shared watermark configuration',
    'Runs entirely in your browser — your images are never uploaded to a server'
  ],

  howToTitle: 'How to Add a Watermark to an Image',
  howTo: [
    { title: 'Upload your images', description: 'Click "Select images" or drag and drop one or more photos onto the upload area.' },
    { title: 'Choose Text or Image', description: 'Pick "Text" to type a watermark message, or "Image / Logo" to upload a logo file to overlay instead.' },
    { title: 'Style your watermark', description: 'For text, set the content, color, font, and size. For an image watermark, set its size relative to the photo.' },
    { title: 'Position and fine-tune', description: 'Pick a position from the 9-point grid, then adjust opacity, rotation, and edge margin until the live preview looks right.' },
    { title: 'Download watermarked images', description: 'Click "Download" to apply the watermark to every uploaded image and save the result — a single file, or a ZIP if you uploaded more than one.' }
  ],

  commonErrorsTitle: 'Common Watermark Errors and Pitfalls',
  commonErrors: [
    { title: 'Watermark too faint or too bold to read', description: 'Opacity below roughly 30% can make a watermark nearly invisible on busy backgrounds, while opacity near 100% can distract from the photo itself — aim for a middle ground and check the live preview against your actual image.' },
    { title: 'Text watermark not showing', description: 'The watermark text field must contain text — an empty watermark message will prevent the download from proceeding until you enter something.' },
    { title: 'Logo watermark not showing', description: 'In Image/Logo mode, you must upload a watermark image first — the download will prevent proceeding until a logo file is selected.' },
    { title: 'Watermark color blending into the image', description: 'A white watermark can disappear against a light background, and a black watermark can disappear against a dark one — pick a color (and opacity) that contrasts with the typical content of your photos.' },
    { title: 'Position looks different across images of different aspect ratios', description: 'The same position and margin settings are applied proportionally to every image, but very differently shaped photos (e.g. a square versus a wide panorama) can make the same relative position feel visually different — check each image in the thumbnail strip before downloading.' }
  ],

  examplesTitle: 'Watermark Example',
  examples: [
    {
      title: 'Adding a copyright text watermark',
      description: 'A common case protecting a batch of portfolio photos.',
      input: '12 photos, text "© Jane Doe 2026", bottom-right position, 60% opacity, white text',
      output: '12 watermarked photos, each with the same copyright text stamped in the bottom-right corner'
    },
    {
      title: 'Branding photos with a logo',
      description: 'Applying a business logo across a set of product images.',
      input: '20 product photos, logo image watermark, size 15% of image width, bottom-center position',
      output: '20 photos with the logo consistently placed bottom-center on each image'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Watermarking happens entirely in your browser using the Canvas API. Your photos and logo file are never sent to a server.' },
    { question: 'Can I watermark multiple images with the same settings?', answer: 'Yes — upload a batch of images, configure the watermark once, and it\'s applied identically to every image when you download.' },
    { question: 'Can I use both text and an image watermark on the same photo?', answer: 'Not simultaneously — the tool applies one watermark type (Text or Image/Logo) at a time per batch. Run the tool twice if you need both on the same photos.' },
    { question: 'Does the watermark size stay consistent across images of different sizes?', answer: 'Yes — text and logo size are set as a percentage of each image\'s own width, so the watermark scales proportionally rather than being a fixed pixel size that would look tiny on a large photo or huge on a small one.' },
    { question: 'Can I rotate the watermark diagonally, like a stock photo?', answer: 'Yes, use the rotation slider to angle the watermark anywhere from -180° to 180°, combined with the center position for a classic diagonal stock-photo look.' },
    { question: 'Will the watermark be removable by someone else?', answer: 'A watermark applied to the pixels of an exported image is baked in and can\'t be cleanly removed without visible artifacts, though determined editing can sometimes reduce its visibility — higher opacity and more central placement make a watermark harder to remove.' }
  ]
};
