import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const BASE64_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Base64',

  whatIsTitle: 'What is Base64?',
  whatIsBody: [
    'Base64 is a binary-to-text encoding scheme that represents binary data using only 64 printable ASCII characters (A–Z, a–z, 0–9, +, and /), with = used for padding. It works by grouping input bytes into 6-bit chunks and mapping each chunk to one of those 64 characters, which is why encoded output is roughly 33% larger than the original data.',
    'Because Base64 output contains only safe, printable characters, it can travel unmodified through systems that were only designed to handle text — email bodies, JSON payloads, URLs, XML documents, and HTTP headers. This makes it the standard way to embed binary data (images, files, cryptographic keys) inside text-based formats like MIME email, data URIs, and JWTs.'
  ],

  whatIsToolTitle: 'What is this Base64 tool?',
  whatIsToolBody: [
    'This is a browser-based Base64 encoder and decoder. Type or paste text into the input panel and it converts it to Base64, or paste a Base64 string and it decodes it back to readable text — both directions use the same input box, so you simply choose "Encode to Base64" or "Decode from Base64" depending on what you\'re starting with.',
    'It supports three character encodings (UTF-8, ASCII, Latin1) for interpreting the underlying text, and three output formats (standard Base64, URL-safe Base64, and MIME with 76-character line wrapping) for encoding. You can also upload a text file instead of pasting content, swap the input and output with one click, and copy or download the result — all processing happens locally in your browser, so nothing is sent to a server.'
  ],

  whyUseTitle: 'Why Use Base64 Encoding?',
  whyUseItems: [
    'Safe transport — encode binary or special-character data so it can pass through text-only channels like email, form fields, and query strings without corruption.',
    'Data URIs — embed small images, fonts, or files directly inside HTML/CSS using data:image/png;base64,... instead of a separate network request.',
    'API and token payloads — many APIs and formats (like JWT headers/payloads) encode JSON or binary content as Base64 so it can be included in headers or URLs safely.',
    'Debugging — quickly decode a Base64-encoded API response, auth token, or config value to see what it actually contains, or encode a string to see what a service will receive.',
    'Avoiding encoding issues — Base64 sidesteps problems with special characters, line endings, and non-ASCII bytes that would otherwise break plain-text protocols.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Encode text to Base64 or decode Base64 back to text from a single input box',
    'Choose the character encoding used to interpret text: UTF-8, ASCII, or Latin1',
    'Choose the output format when encoding: Standard Base64, URL-Safe Base64, or MIME (76 characters per line)',
    'Automatic normalization when decoding: strips whitespace/newlines, converts URL-safe characters back to standard, and re-adds missing padding',
    'Upload a text file directly instead of pasting content',
    'Swap input and output with one click to chain operations or re-encode a decoded result',
    'Live character counts for both input and output',
    'Copy output to clipboard or download it as a .txt file',
    'Built-in sample buttons to see a realistic encode and decode example instantly',
    'Runs entirely in your browser — your data is never uploaded to a server'
  ],

  howToTitle: 'How to Use the Base64 Encoder/Decoder',
  howTo: [
    { title: 'Enter your content', description: 'Paste or type text into the Input box, or click "Upload file" to load a text file from disk. Click "Sample Encode" or "Sample Decode" to try the tool with pre-filled example data.' },
    { title: 'Pick your options', description: 'In the Actions panel, choose the Character Encoding (UTF-8 is recommended for most text) and, if you\'re encoding, the Output Format — Standard, URL-Safe, or MIME.' },
    { title: 'Encode or decode', description: 'Click "Encode to Base64" to convert plain text into Base64, or "Decode from Base64" to convert a Base64 string back into readable text.' },
    { title: 'Review the result', description: 'The Output panel shows the converted text along with a success message and character count, or an error message if the input couldn\'t be decoded.' },
    { title: 'Swap, copy, or download', description: 'Use "⇄ Swap" to move the output back into the input (handy for round-tripping or re-encoding), "Copy Output" to copy it to your clipboard, or "Download Output" to save it as a .txt file.' }
  ],

  commonErrorsTitle: 'Common Base64 Errors and Pitfalls',
  commonErrors: [
    { title: 'Invalid or missing padding', description: 'Valid Base64 length must be a multiple of 4, with = characters padding the end when needed. This tool automatically adds missing padding when decoding, but a string with the wrong amount of padding from another source can still fail to decode correctly.' },
    { title: 'Non-Base64 characters in the input', description: 'Decoding fails if the input contains characters outside the Base64 alphabet (A–Z, a–z, 0–9, +, /, and = for padding). Copy-paste errors, stray HTML, or accidentally including surrounding quotes are common culprits.' },
    { title: 'Confusing standard and URL-safe alphabets', description: 'Standard Base64 uses + and /, while URL-safe Base64 replaces them with - and _ (and often omits padding). This tool automatically converts - and _ back to + and / when decoding, so both variants decode correctly, but if you need URL-safe output specifically, select "URL-Safe Base64" in Output Format when encoding.' },
    { title: 'Wrong character encoding on decode', description: 'If text was originally encoded as UTF-8 but you decode it while set to ASCII/Latin1 (or vice versa), multi-byte characters like emoji or accented letters can come out garbled. Match the Character Encoding setting to how the data was originally encoded.' },
    { title: 'Decoding truncated Base64', description: 'If a Base64 string was cut off mid-copy (e.g. from a chat window or log line with a length limit), the remaining characters won\'t form complete 6-bit groups and decoding will produce corrupted or incomplete output rather than a clean error.' },
    { title: 'Expecting binary output as readable text', description: 'This tool decodes Base64 into text, not raw binary files. Decoding Base64 that actually represents an image or other binary file will produce unreadable characters in the output box rather than a usable file.' }
  ],

  examplesTitle: 'Base64 Encoding Examples',
  examples: [
    {
      title: 'Encode plain text (UTF-8, standard format)',
      description: 'A simple sentence encoded with the default UTF-8 encoding and standard Base64 output.',
      input: 'Hello, World!',
      output: 'SGVsbG8sIFdvcmxkIQ=='
    },
    {
      title: 'Decode back to text',
      description: 'The same Base64 string decoded back to its original plain text.',
      input: 'SGVsbG8sIFdvcmxkIQ==',
      output: 'Hello, World!'
    },
    {
      title: 'Standard vs. URL-safe output',
      description: 'Encoding a string that produces + and / characters shows the difference between Standard and URL-Safe output formats.',
      input: 'Subjects?_d',
      output: 'Standard: U3ViamVjdHM/X2Q=\nURL-Safe: U3ViamVjdHM_X2Q'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. Encoding and decoding happen entirely in your browser using built-in JavaScript APIs. Your text is never sent to a server.' },
    { question: 'Is Base64 encryption?', answer: 'No. Base64 is an encoding scheme, not encryption — it provides no security or confidentiality. Anyone can decode Base64 back to the original data instantly, so never use it to protect sensitive information like passwords.' },
    { question: 'Why is my Base64 output longer than the original text?', answer: 'Base64 encodes every 3 bytes of input as 4 characters of output, so encoded data is always about 33% larger than the original.' },
    { question: 'What\'s the difference between Standard, URL-Safe, and MIME formats?', answer: 'Standard Base64 uses + and / and is the most common form. URL-Safe Base64 replaces those with - and _ so the result can be used in URLs or filenames without extra escaping. MIME format wraps the output every 76 characters with line breaks, matching the format used in email attachments (RFC 2045).' },
    { question: 'Why does decoding fail with "Invalid Base64 string"?', answer: 'This usually means the input contains characters that aren\'t part of the Base64 alphabet, or the text isn\'t actually valid Base64 to begin with. Double-check that you copied the full string without extra characters like quotes or HTML tags.' },
    { question: 'Which Character Encoding should I choose?', answer: 'UTF-8 is recommended for almost all text, including non-English languages and emoji, since it\'s the standard on the modern web. Use ASCII or Latin1 only if you know the source data was encoded that way.' },
    { question: 'Can I encode or decode a whole file, not just text?', answer: 'You can upload a text file and it will be read as text into the input box for encoding. This tool is designed for text-based content — it does not read arbitrary binary files (like images) for encoding.' }
  ]
};
